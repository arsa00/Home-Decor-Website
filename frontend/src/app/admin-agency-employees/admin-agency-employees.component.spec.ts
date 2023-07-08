import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgencyEmployeesComponent } from './admin-agency-employees.component';

describe('AdminAgencyEmployeesComponent', () => {
  let component: AdminAgencyEmployeesComponent;
  let fixture: ComponentFixture<AdminAgencyEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAgencyEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAgencyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
