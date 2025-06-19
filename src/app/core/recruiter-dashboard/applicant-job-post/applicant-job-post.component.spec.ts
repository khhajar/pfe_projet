import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantJobPostComponent } from './applicant-job-post.component';

describe('ApplicantJobPostComponent', () => {
  let component: ApplicantJobPostComponent;
  let fixture: ComponentFixture<ApplicantJobPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantJobPostComponent]
    });
    fixture = TestBed.createComponent(ApplicantJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
