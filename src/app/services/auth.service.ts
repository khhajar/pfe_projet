import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  getAuthState() {
    return this.afAuth.authState;
  }

  async register(
    email: string,
    password: string,
    role: 'candidate' | 'recruiter'
  ) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    if (user) {
      const userData = { uid: user.uid, email, role };
      await this.firestore.collection('users').doc(user.uid).set(userData);
    }
    return user;
  }

  async login(email: string, password: string) {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    if (user) {
      this.firestore
        .collection<User>('users')
        .doc(user.uid)
        .valueChanges()
        .pipe(take(1))
        .subscribe((userData) => {
          if (userData) {
            this.localStorageService.setItem('user', { ...userData });
            this.user$.next(userData);
          }
        });
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.user$.next(null);
      this.localStorageService.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  /* reset password */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const userDoc = await this.firestore
        .collection('users')
        .ref.where('email', '==', email)
        .get();

      return !userDoc.empty;
    } catch (error: any) {
      console.error('Error checking email existence in Firestore:', error);
      return false;
    }
  }

  async resetPassword(email: string) {
    const emailExists = await this.checkEmailExists(email);

    if (!emailExists) {
      return {
        success: false,
        error: 'No account found for this email address.',
      };
    }

    try {
      await this.afAuth.sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'Password reset link sent if email exists.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'An error occurred. Please try again later.',
      };
    }
  }
}
