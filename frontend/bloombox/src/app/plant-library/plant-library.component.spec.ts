import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantLibraryComponent } from './plant-library.component';

describe('PlantLibraryComponent', () => {
  let component: PlantLibraryComponent;
  let fixture: ComponentFixture<PlantLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
