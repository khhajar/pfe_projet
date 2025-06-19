import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaProfileComponent } from './media-profile.component';

describe('MediaProfileComponent', () => {
  let component: MediaProfileComponent;
  let fixture: ComponentFixture<MediaProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediaProfileComponent]
    });
    fixture = TestBed.createComponent(MediaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
