import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLinksFormComponent } from './social-links-form.component';

describe('SocialLinksFormComponent', () => {
  let component: SocialLinksFormComponent;
  let fixture: ComponentFixture<SocialLinksFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialLinksFormComponent]
    });
    fixture = TestBed.createComponent(SocialLinksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
