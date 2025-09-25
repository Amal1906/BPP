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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tenant-details',
  standalone: true,
  imports: [NgbModule, CommonModule, ReactiveFormsModule, FormsModule, DropdownModule, LoaderComponent, FormatDataTimePipe, StepperComponent, MatIconModule],
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
  workItem: string = '';   //NEW: store work_item
  steps: any;

  constructor(private router: Router,
    private route: ActivatedRoute, private dataService: DataService, private toastr: ToastrService, private formatDateTimePipe: FormatDataTimePipe) { }

  workFlow: Step[] = [];

  private mapStepsToStepper(rawSteps: any[], workflowKey: string): Step[] {
    const workflowSteps = WORKFLOWS[workflowKey] || [];
    
    // Create a map of database steps by step_name
    const stepsMap: { [key: string]: any } = {};
    rawSteps.forEach(step => {
      if (step.step_name) {
        stepsMap[step.step_name.toLowerCase()] = step;
      }
    });

    // Get specific steps from database (check multiple possible variations)
    const documentDownloadStep = stepsMap['document download'];
    const documentAnalysisStep = stepsMap['document analysis'];
    
    // Check multiple variations for Send COI Document step
    const sendCOIStep = stepsMap['send coi document'] || 
                       stepsMap['send coi documents'] || 
                       stepsMap['send coi doc'] ||
                       stepsMap['send coi'] ||
                       Object.values(stepsMap).find(step => 
                         step.step_name?.toLowerCase().includes('send') && 
                         step.step_name?.toLowerCase().includes('coi')
                       );
    
    console.log('Debug - Steps Map:', stepsMap);
    console.log('Debug - Send COI Step:', sendCOIStep);
    
    const stepper: Step[] = [];

    if (workflowKey === 'policy_checking' || workflowKey === 'policy checking') {
      // Policy Checking Workflow Logic - Updated Rules
      
      workflowSteps.forEach((stepName, index) => {
        let status: Step['status'] = 'pending';
        let message = '';

        switch (stepName.toLowerCase()) {
          case 'read input files':
            if (rawSteps.length === 0) {
              // No steps in DB - mark as in progress (blue)
              status = 'inprogress';
              message = 'Starting to read input files';
            } else if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus !== 'in progress') {
                // Document Download exists and is NOT in progress (completed/failed) - mark as completed
                status = 'done';
                message = 'Input files read successfully';
              } else {
                // Document Download is in progress - keep as in progress
                status = 'inprogress';
                message = 'Reading input files';
              }
            } else {
              // Some steps exist but no Document Download yet - keep as in progress
              status = 'inprogress';
              message = 'Reading input files';
            }
            break;

          case 'extract metadata':
            if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus !== 'in progress') {
                // Document Download is completed/failed - check if Document Analysis started
                if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() === 'in progress') {
                  // Document Analysis is in progress - mark Extract Metadata as completed
                  status = 'done';
                  message = 'Metadata extraction completed';
                } else if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() === 'completed') {
                  // Document Analysis is completed - mark Extract Metadata as completed
                  status = 'done';
                  message = 'Metadata extraction completed';
                } else {
                  // Document Download done but Document Analysis not started - mark as in progress
                  status = 'inprogress';
                  message = 'Extracting metadata from documents';
                }
              } else {
                // Document Download still in progress - keep as pending
                status = 'pending';
                message = 'Waiting for document download to complete';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document download to start';
            }
            break;

          case 'classify documents':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus === 'in progress') {
                // Document Analysis is in progress - mark as in progress
                status = 'inprogress';
                message = documentAnalysisStep.comments || 'Classifying documents';
              } else if (analysisStatus === 'completed') {
                // Document Analysis is completed - mark as completed
                status = 'done';
                message = 'Document classification completed';
              } else {
                status = 'pending';
                message = 'Waiting for document analysis';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document analysis to start';
            }
            break;

          case 'generate checklist':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus === 'completed') {
                // Document Analysis is completed - mark as completed
                status = 'done';
                message = 'Checklist generated successfully';
              } else {
                status = 'pending';
                message = 'Waiting for document analysis to complete';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document analysis';
            }
            break;

          case 'upload checklist to target system':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus === 'completed') {
                // Document Analysis is completed - mark as completed
                status = 'done';
                message = 'Checklist uploaded to target system';
              } else {
                status = 'pending';
                message = 'Waiting for document analysis to complete';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document analysis';
            }
            break;

          default:
            status = 'pending';
            message = 'Step pending';
        }

        stepper.push({
          step: stepName,
          status,
          status_message: message
        });
      });

    } else if (workflowKey === 'coi') {
      // COI Workflow Logic - Updated Rules
      
      workflowSteps.forEach((stepName, index) => {
        let status: Step['status'] = 'pending';
        let message = '';

        switch (stepName.toLowerCase()) {
          case 'read input files':
            if (rawSteps.length === 0) {
              // No steps in DB - mark as in progress (blue)
              status = 'inprogress';
              message = 'Starting to read input files';
            } else if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus !== 'in progress') {
                // Document Download exists and is NOT in progress (completed/failed) - mark as completed
                status = 'done';
                message = 'Input files read successfully';
              } else {
                // Document Download is in progress - keep as in progress
                status = 'inprogress';
                message = 'Reading input files';
              }
            } else {
              // Some steps exist but no Document Download yet - keep as in progress
              status = 'inprogress';
              message = 'Reading input files';
            }
            break;

          case 'extract metadata':
            if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus !== 'in progress') {
                // Document Download is completed/failed - check if Document Analysis started
                if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() !== 'in progress') {
                  // Document Analysis exists and is NOT in progress - mark Extract Metadata as completed
                  status = 'done';
                  message = 'Metadata extraction completed';
                } else if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() === 'in progress') {
                  // Document Analysis is in progress - mark Extract Metadata as completed
                  status = 'done';
                  message = 'Metadata extraction completed';
                } else {
                  // Document Download done but Document Analysis not started - mark as in progress
                  status = 'inprogress';
                  message = 'Extracting metadata from documents';
                }
              } else {
                // Document Download still in progress - keep as pending
                status = 'pending';
                message = 'Waiting for document download to complete';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document download to start';
            }
            break;

          case 'generate coi':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus !== 'in progress') {
                // Document Analysis is NOT in progress (completed/failed) - check if Send COI Document started
                if (sendCOIStep && sendCOIStep.step_status?.toLowerCase() === 'in progress') {
                  // Send COI Document is in progress - mark Generate COI as completed
                  status = 'done';
                  message = 'COI document generated successfully';
                } else if (sendCOIStep && sendCOIStep.step_status?.toLowerCase() !== 'in progress') {
                  // Send COI Document exists and is NOT in progress - mark Generate COI as completed
                  status = 'done';
                  message = 'COI document generated successfully';
                } else {
                  // Document Analysis done but Send COI Document not started - mark as in progress
                  status = 'inprogress';
                  message = 'Generating COI document';
                }
              } else {
                // Document Analysis still in progress - keep as pending
                status = 'pending';
                message = 'Waiting for document analysis to complete';
              }
            } else {
              status = 'pending';
              message = 'Waiting for document analysis to start';
            }
            break;

          case 'email to requestor':
            if (sendCOIStep) {
              const sendCOIStatus = sendCOIStep.step_status?.toLowerCase();
              if (sendCOIStatus === 'in progress') {
                // Send COI Document is in progress - mark Email as in progress
                status = 'inprogress';
                message = sendCOIStep.comments || 'Sending COI email to requestor';
              } else if (sendCOIStatus !== 'in progress') {
                // Send COI Document is NOT in progress (completed/failed) - mark Email as completed
                status = 'done';
                message = sendCOIStep.comments || 'COI email sent successfully';
              } else {
                status = 'pending';
                message = 'Waiting to send COI email';
              }
            } else {
              // No Send COI Document step yet
              if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() !== 'in progress') {
                // Document Analysis is completed/failed but no Send COI step - keep as pending
                status = 'pending';
                message = 'Ready to send COI email';
              } else {
                status = 'pending';
                message = 'Waiting for COI generation to complete';
              }
            }
            break;

          default:
            status = 'pending';
            message = 'Step pending';
        }

        stepper.push({
          step: stepName,
          status,
          status_message: message
        });
      });

    } else {
      // Generic workflow logic for other workflows
      return this.mapGenericStepsToStepper(rawSteps, workflowSteps);
    }

    return stepper;
  }

  // Generic method for other workflows (your existing logic)
  private mapGenericStepsToStepper(rawSteps: any[], workflowSteps: string[]): Step[] {
    const stepsMap: { [key: string]: any } = {};
    rawSteps.forEach(s => {
      if (s.step_name) stepsMap[s.step_name.toLowerCase()] = s;
    });

    const stepper: Step[] = [];
    let foundInProgress = false;

    workflowSteps.forEach((wfStep, index) => {
      const dbStep = stepsMap[wfStep.toLowerCase()];
      let status: Step['status'] = 'pending';
      let message = dbStep?.comments || '';

      if (dbStep) {
        const s = dbStep.step_status?.toLowerCase();
        if (s === 'completed' || s === 'success') {
          status = 'done';
        } else if (s === 'in progress' || s === 'processing') {
          status = 'inprogress';
          foundInProgress = true;
        } else if (s === 'failed' || s === 'error') {
          status = 'failed';
        }
      } else {
        if (!foundInProgress && index === 0) {
          status = 'inprogress';
          foundInProgress = true;
        }
      }

      stepper.push({
        step: wfStep,
        status,
        status_message: message
      });
    });

    return stepper;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.processRefId = params.get('process_ref_id') || '';
      this.workItem = params.get('work_item')?.toLowerCase() || ''; //capture work_item
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
            //dynamically pick workflow instead of hardcoding
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

  /**
   * Gets the appropriate Material icon for a given status
   * @param {string} status - The status to get icon for
   * @returns {string} The Material icon name
   */
  getStatusIcon(status: string): string {
    if (!status) {
      return 'help_outline';
    }

    const normalizedStatus = status.toLowerCase();

    const iconMap: { [key: string]: string } = {
      'in progress': 'hourglass_empty',
      'processing': 'hourglass_empty',
      'completed': 'check_circle',
      'success': 'check_circle',
      'failed': 'error',
      'error': 'error',
      'pending': 'schedule',
    };

    return iconMap[normalizedStatus] || 'help_outline';
  }

  navigateBack() {
    this.router.navigate(['/layout/details']);
  }

  onRefresh() {
    this.loadSteps();
  }
}