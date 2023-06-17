import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencySearchCardComponent } from './agency-search-card.component';

describe('AgencySearchCardComponent', () => {
  let component: AgencySearchCardComponent;
  let fixture: ComponentFixture<AgencySearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencySearchCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencySearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
