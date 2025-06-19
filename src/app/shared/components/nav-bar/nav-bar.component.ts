import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAuthenticated = false;
  userRole: 'candidate' | 'recruiter' | null = null;
  linked: { name: string; url: string }[] = [];
  private userSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.setUserState(user);
      } else {
        this.isAuthenticated = false;
        this.userRole = null;
        this.updateNavigation();
      }
    });

    // Check if the user is already authenticated from local storage on initial load
    const storedUser = this.localStorageService.getItem('user');
    if (storedUser) {
      this.setUserState(storedUser);
    }
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Check if the user is authenticated
  private setUserState(user: any) {
    this.userRole = user.role;
    this.isAuthenticated = true;
    this.updateNavigation();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goRegistration(): void {
    this.router.navigate(['/choice-signup']);
  }

  async logout() {
    await this.authService.logout();
    this.toastr.info('Logout successfully');
    this.isAuthenticated = false;
    this.userRole = null;
    this.updateNavigation();
  }

  // Update navigation links based on authentication and role
  private updateNavigation(): void {
    if (!this.isAuthenticated) {
      this.linked = [
        { name: 'Home', url: '/home' },
        { name: 'Find Jobs', url: '/find-job' },
      ];
    } else if (this.userRole === 'recruiter') {
      this.linked = [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'Search CV', url: '/search-cv' },
        { name: 'Company', url: '/profile/company' },
      ];
      //this.router.navigate(['/profile/company']);
    } else {
      this.linked = [
        { name: 'Find Jobs', url: '/find-job' },
        { name: 'Applications', url: '/candidate/applications' },
        { name: 'Profile', url: '/profile/candidate' },
      ];
      //this.router.navigate(['/profile/candidate']);
    }
  }
}
