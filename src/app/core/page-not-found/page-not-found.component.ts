import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
})
export class PageNotFoundComponent {
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.start();
    setTimeout(() => this.loadingService.stop(), 500);
  }
}
