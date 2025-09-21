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
import { Step, StepperComponent } from '../../../shared/stepper/stepper.component';
import { WORKFLOWS } from '../../../data/workflow.config';

@Component({
  selector: 'app-tenant-details',
  standalone: true,
  imports: [NgbModule, CommonModule, ReactiveFormsModule, FormsModule, DropdownModule, LoaderComponent, FormatDataTimePipe, StepperComponent],
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
  workItem: string = '';   // ✅ NEW: store work_item
  steps: any;

  constructor(private router: Router,
    private route: ActivatedRoute, private dataService: DataService, private toastr: ToastrService, private formatDateTimePipe: FormatDataTimePipe) { }

  workFlow: Step[] = [];

  private mapStepsToStepper(rawSteps: any[], workflowKey: string): Step[] {
    const workflowSteps = WORKFLOWS[workflowKey] || [];

    return workflowSteps.map((wfStep) => {
      const backendStep = rawSteps.find(
        s => s.step_name?.toLowerCase() === wfStep.toLowerCase()
      );

      if (!backendStep) {
        return { step: wfStep, status: 'pending', status_message: '' };
      }

      let status: Step['status'] = 'pending';
      switch (backendStep.step_status?.toLowerCase()) {
        case 'completed': status = 'done'; break;
        case 'in progress': status = 'inprogress'; break;
        case 'failed': status = 'failed'; break;
      }

      return {
        step: wfStep,
        status,
        status_message: backendStep.comments || ''
      };
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.processRefId = params.get('process_ref_id') || '';
      this.workItem = params.get('work_item')?.toLowerCase() || ''; // ✅ capture work_item
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
            // ✅ dynamically pick workflow instead of hardcoding
            const workflowKey = this.workItem === 'policy checking' ? 'policy_checking' : this.workItem;
            this.workFlow = this.mapStepsToStepper(response, workflowKey);
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

  getStatusBadge(status: string): { statusText: string; statusClass: string } {
    if (!status) {
      return { statusText: 'No Status', statusClass: 'inactive' };
    }

    const normalizedStatus = status.toLowerCase();

    const statusMap: { [key: string]: { statusText: string; statusClass: string } } = {
      'in progress': { statusText: 'In Progress', statusClass: 'pending' },
      'processing': { statusText: 'In Progress', statusClass: 'pending' },
      'completed': { statusText: 'Completed', statusClass: 'active' },
      'success': { statusText: 'Completed', statusClass: 'active' },
      'failed': { statusText: 'Failed', statusClass: 'inactive' },
      'error': { statusText: 'Failed', statusClass: 'inactive' },
      'pending': { statusText: 'Pending', statusClass: 'pending' },
    };

    return statusMap[normalizedStatus] || { statusText: status, statusClass: 'default' };
  }

  navigateBack() {
    this.router.navigate(['/layout/dashboard']);
  }

  onRefresh() {
    this.loadSteps();
  }
}
