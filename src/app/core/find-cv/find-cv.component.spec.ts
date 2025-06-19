import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCvComponent } from './find-cv.component';

describe('FindCvComponent', () => {
  let component: FindCvComponent;
  let fixture: ComponentFixture<FindCvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindCvComponent]
    });
    fixture = TestBed.createComponent(FindCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
