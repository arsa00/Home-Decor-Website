import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyJobListComponent } from './agency-job-list.component';

describe('AgencyJobListComponent', () => {
  let component: AgencyJobListComponent;
  let fixture: ComponentFixture<AgencyJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyJobListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
