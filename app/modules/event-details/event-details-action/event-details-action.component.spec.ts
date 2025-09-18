import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsActionComponent } from './event-details-action.component';

describe('EventDetailsActionComponent', () => {
  let component: EventDetailsActionComponent;
  let fixture: ComponentFixture<EventDetailsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDetailsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
