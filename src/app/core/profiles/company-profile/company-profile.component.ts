import { Component } from '@angular/core';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
})
export class CompanyProfileComponent {
  pages: { path: string; name: string }[] = [
    { path: 'main-info', name: 'Main Information' },
    { path: 'online-presence', name: 'Online Presence' },
  ];
}
