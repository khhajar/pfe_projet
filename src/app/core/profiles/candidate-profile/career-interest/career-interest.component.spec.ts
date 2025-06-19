import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerInterestComponent } from './career-interest.component';

describe('CareerInterestComponent', () => {
  let component: CareerInterestComponent;
  let fixture: ComponentFixture<CareerInterestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerInterestComponent]
    });
    fixture = TestBed.createComponent(CareerInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
