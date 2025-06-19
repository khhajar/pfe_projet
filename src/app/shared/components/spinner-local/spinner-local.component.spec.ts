import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerLocalComponent } from './spinner-local.component';

describe('SpinnerLocalComponent', () => {
  let component: SpinnerLocalComponent;
  let fixture: ComponentFixture<SpinnerLocalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerLocalComponent]
    });
    fixture = TestBed.createComponent(SpinnerLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
