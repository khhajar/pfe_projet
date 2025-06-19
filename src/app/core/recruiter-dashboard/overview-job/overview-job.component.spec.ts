import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewJobComponent } from './overview-job.component';

describe('OverviewJobComponent', () => {
  let component: OverviewJobComponent;
  let fixture: ComponentFixture<OverviewJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewJobComponent]
    });
    fixture = TestBed.createComponent(OverviewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
