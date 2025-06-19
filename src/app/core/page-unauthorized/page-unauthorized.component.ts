import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-page-unauthorized',
  templateUrl: './page-unauthorized.component.html',
  styleUrls: ['./page-unauthorized.component.css'],
})
export class PageUnauthorizedComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.start();
    setTimeout(() => this.loadingService.stop(), 500);
  }

  goToProfilePage(): void {
    const user = this.localStorageService.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      this.loadingService.stop();
      return;
    }

    const route =
      user.role === 'candidate' ? '/profile/candidate' : '/profile/company';
    this.router.navigate([route]);
  }
}
