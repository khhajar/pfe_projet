import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(route: any): any {
    return this.authService.getAuthState().pipe(
      map((user) => {
        if (user) {
          const userData = this.localStorageService.getItem('user');
          if (userData && userData.role === route.data.role) {
            return true;
          } else {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
