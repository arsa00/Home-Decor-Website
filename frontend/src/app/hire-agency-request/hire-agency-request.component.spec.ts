import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAgencyRequestComponent } from './hire-agency-request.component';

describe('HireAgencyRequestComponent', () => {
  let component: HireAgencyRequestComponent;
  let fixture: ComponentFixture<HireAgencyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireAgencyRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireAgencyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
