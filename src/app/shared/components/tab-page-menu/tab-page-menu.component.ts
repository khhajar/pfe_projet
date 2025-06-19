import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab-page-menu',
  templateUrl: './tab-page-menu.component.html',
  styleUrls: ['./tab-page-menu.component.css'],
})
export class TabPageMenuComponent implements OnInit {
  isMenuOpen = false;
  @Input() pages: { path: string; name: string }[] = [];
  isMobileView = false;
  currentPath: string = '';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileView = window.innerWidth < 768;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isMobileView = window.innerWidth < 768;
    this.route.firstChild?.url.subscribe((urlSegments) => {
      this.currentPath = urlSegments[0]?.path || '';
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isCurrentPage(path: string): boolean {
    return this.currentPath === path;
  }
}
