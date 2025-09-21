import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-actions',
  standalone: true,
  imports: [MatTooltip],
  templateUrl: './event-details-action.component.html',
  styleUrl: './event-details-action.component.scss'
})
export class EventDetailsActionComponent {

  process_ref_id: string = '';
  work_item: string = '';   // ✅ added this
  id: string = '';
  params: any;
  isButtonDisabled: boolean = false;
  isFeatureEnabled: boolean = false;

  @ViewChild('modalButton') modalButton!: ElementRef;

  constructor(private router: Router) {}

  /**
   * Initializes the component with grid parameters
   * @param {any} params - Grid parameters containing event data
   */
  agInit(params: any): void {
    this.params = params;
    this.process_ref_id = this.params.data.process_ref_id;
    this.work_item = this.params.data.process_type;   // ✅ capture process_type as work_item
  }

  /**
   * Navigates to the step details view with current event parameters
   * @return {void}
   */
  routeToView(): void {
    console.log(
      "Navigating to step details for process_ref_id:",
      this.process_ref_id,
      " work_item:",
      this.work_item
    );

    this.router.navigate(['/layout/details/step-details/'], {
      queryParams: {
        process_ref_id: this.process_ref_id,
        work_item: this.work_item   // ✅ pass work_item also
      }
    });
  }
}
