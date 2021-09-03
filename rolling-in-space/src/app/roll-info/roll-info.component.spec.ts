import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollInfoComponent } from './roll-info.component';

describe('RollInfoComponent', () => {
  let component: RollInfoComponent;
  let fixture: ComponentFixture<RollInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
