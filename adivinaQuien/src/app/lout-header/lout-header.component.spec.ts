import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoutHeaderComponent } from './lout-header.component';

describe('LoutHeaderComponent', () => {
  let component: LoutHeaderComponent;
  let fixture: ComponentFixture<LoutHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoutHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
