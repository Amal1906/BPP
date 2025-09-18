

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../service/data.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormatDataTimePipe } from '../../../data/pipe/format-date-time.pipe';
import { StepperComponent } from './stepper/stepper.component';

@Component({
  selector: 'app-tenant-details',
  standalone: true,
  imports: [NgbModule, CommonModule , ReactiveFormsModule, FormsModule, DropdownModule, LoaderComponent, FormatDataTimePipe, StepperComponent],
  providers: [
    FormatDataTimePipe, DatePipe
  ],
  templateUrl: './step-details.component.html',
  styleUrl: './step-details.component.scss'
})
export class StepDetailsComponent implements OnInit {


  isSubmitted: boolean = false;
  isLoading: boolean = false;

  processRefId: string = ''; 
  steps: any;
  workType: string = '';

  constructor(private router: Router,
    private route: ActivatedRoute, private dataService: DataService, private toastr: ToastrService, private formatDateTimePipe: FormatDataTimePipe) { }

    /**
   * Angular lifecycle hook that initializes the component
   * Loads path parameters and triggers step loading if parameters are valid
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.processRefId = params.get('process_ref_id') || '';
      this.workType = params.get('work_type') || '';
      if (this.processRefId) {
        this.loadSteps();
      } 
    });
  }

  /**
   * Loads step details from the data service
   * Handles different response scenarios and error cases
   */
  loadSteps(): void {
    this.isLoading = true;
    this.steps = [];
    
    this.dataService.getEventSteps(this.processRefId).subscribe({
      next: (response: any) => {
          if (response && response.status == 'error') {
            this.steps = [];
            this.isLoading = false;
            return;
          }
          if (Array.isArray(response) && response.length == 0) {
            this.toastr.error('No step details available');
            this.steps = [];
            this.isLoading = false;
            return;
          }
          if (Array.isArray(response)) {
            this.steps = response;
            this.isLoading = false;
            return;
          }
          this.steps = [];
          this.isLoading = false;
        },
      error: (error) => {
        let errorMessage = 'Event found with no steps yet';
        this.toastr.error(errorMessage); 
        this.steps = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Determines the appropriate badge styling for a given step status
   * @param {string} status - The status to evaluate
   * @return {{statusText: string, statusClass: string}} Object containing display text and CSS class for the status
   */
   getStatusBadge(status: string): { statusText: string; statusClass: string } {
    if (!status) {
      return { statusText: 'No Status', statusClass: 'inactive' };
    }
    const normalizedStatus = status.toLowerCase();
    const statusMap: { [key: string]: { statusText: string; statusClass: string } } = {
      'in progress': { statusText: 'In Progress', statusClass: 'pending' },
      'completed': { statusText: 'Completed', statusClass: 'active' },
      'failed': { statusText: 'Failed', statusClass: 'inactive' },
      'pending': { statusText: 'Pending', statusClass: 'pending' },
    };

    return statusMap[normalizedStatus] || { statusText: status, statusClass: 'default' };
  }

   /**
   * Navigates back to the dashboard view
   */
   navigateBack() {
    this.router.navigate(['/layout/dashboard']);
  }

  /**
   * Refreshes the step data by reloading from the server
   */
  onRefresh() {
    this.loadSteps();

  }
}