import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyEmployeesComponent } from './agency-employees.component';

describe('AgencyEmployeesComponent', () => {
  let component: AgencyEmployeesComponent;
  let fixture: ComponentFixture<AgencyEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
