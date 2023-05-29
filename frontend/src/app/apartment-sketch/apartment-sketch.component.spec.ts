import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentSketchComponent } from './apartment-sketch.component';

describe('ApartmentSketchComponent', () => {
  let component: ApartmentSketchComponent;
  let fixture: ComponentFixture<ApartmentSketchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartmentSketchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
