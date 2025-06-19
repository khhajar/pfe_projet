import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCvComponent } from './filter-cv.component';

describe('FilterCvComponent', () => {
  let component: FilterCvComponent;
  let fixture: ComponentFixture<FilterCvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterCvComponent]
    });
    fixture = TestBed.createComponent(FilterCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
