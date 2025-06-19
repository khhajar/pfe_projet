import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePresenceComponent } from './online-presence.component';

describe('OnlinePresenceComponent', () => {
  let component: OnlinePresenceComponent;
  let fixture: ComponentFixture<OnlinePresenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlinePresenceComponent]
    });
    fixture = TestBed.createComponent(OnlinePresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
