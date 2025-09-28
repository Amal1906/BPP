import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalystLibraryComponent } from './catalyst-library.component';

describe('CatalystLibraryComponent', () => {
  let component: CatalystLibraryComponent;
  let fixture: ComponentFixture<CatalystLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalystLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalystLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});