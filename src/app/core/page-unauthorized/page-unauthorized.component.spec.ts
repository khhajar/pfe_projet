import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUnauthorizedComponent } from './page-unauthorized.component';

describe('PageUnauthorizedComponent', () => {
  let component: PageUnauthorizedComponent;
  let fixture: ComponentFixture<PageUnauthorizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageUnauthorizedComponent]
    });
    fixture = TestBed.createComponent(PageUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
