import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInfoCardComponent } from './candidate-info-card.component';

describe('CandidateInfoCardComponent', () => {
  let component: CandidateInfoCardComponent;
  let fixture: ComponentFixture<CandidateInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateInfoCardComponent]
    });
    fixture = TestBed.createComponent(CandidateInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
