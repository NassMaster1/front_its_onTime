import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseDelayComponent } from './cause-delay.component';

describe('CauseDelayComponent', () => {
  let component: CauseDelayComponent;
  let fixture: ComponentFixture<CauseDelayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseDelayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauseDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
