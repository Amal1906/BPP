import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';  // Add ActivatedRoute import

@Component({
  selector: 'app-tenant-actions',
  standalone: true,
  imports: [MatTooltip],
  templateUrl: './event-details-action.component.html',
  styleUrl: './event-details-action.component.scss'
})
export class EventDetailsActionComponent {

  process_ref_id: string = '';
  work_item: string = '';   
  id: string = '';
  params: any;
  isButtonDisabled: boolean = false;
  isFeatureEnabled: boolean = false;

  @ViewChild('modalButton') modalButton!: ElementRef;
  activeFilter: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute  // Inject ActivatedRoute
  ) {}

  agInit(params: any): void {
    this.params = params;
    this.process_ref_id = this.params.data.process_ref_id;
    this.work_item = this.params.data.process_type; 
    this.activeFilter = this.params.context?.activeFilter 
                   || this.params.api?.gridOptionsWrapper?.gridOptions?.activeFilter 
                   || this.params.filter
                   || '';
  }

  routeToView(): void {
    console.log(
      "Navigating to step details for process_ref_id:",
      this.process_ref_id,
      " work_item:",
      this.work_item,
      "source_ref_id:",
      this.params.data.source_ref_id
    );

    // Get ALL current query params from the parent route
    const currentParams = this.route.snapshot.queryParams;

    // Navigate with all params preserved
    this.router.navigate(['/layout/details/step-details/'], {
      queryParams: {
        process_ref_id: this.process_ref_id,
        work_item: this.work_item,
        source_id: this.params.data.source_ref_id,
        // Preserve all existing query params
        start_date: currentParams['start_date'],
        end_date: currentParams['end_date'],
        client: currentParams['client'],
        process_type: currentParams['process_type'],
        filter: this.activeFilter || currentParams['filter']
      }
    });
  }
}