import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalystDetailsModalComponent } from './catalyst-details-modal.component';

describe('CatalystDetailsModalComponent', () => {
  let component: CatalystDetailsModalComponent;
  let fixture: ComponentFixture<CatalystDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalystDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalystDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});