import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPageMenuComponent } from './tab-page-menu.component';

describe('TabPageMenuComponent', () => {
  let component: TabPageMenuComponent;
  let fixture: ComponentFixture<TabPageMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabPageMenuComponent]
    });
    fixture = TestBed.createComponent(TabPageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
