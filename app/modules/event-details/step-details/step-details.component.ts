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
  selector: 'app-step-details',
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
  workItem: string = '';
  steps: any;
  sourceRefId: string = '';

  showDocumentPopup: boolean = false;
  documentList: string[] = [];
  isEditMode: boolean = false;
  availableDocuments: string[] = [];
  selectedSourceDocument: string = '';
  selectedTargetDocuments: string[] = [];
  modelDestinationLob: string = '';


  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private toastr: ToastrService, 
    private formatDateTimePipe: FormatDataTimePipe
  ) { }

  workFlow: Step[] = [];

  openDocumentAnalysis(step: any) {
    if (!this.processRefId) {
      this.toastr.error('Process reference ID is missing.');
      return;
    }

    const stepName = step.step_name || 'Document Analysis';
    const workItem = step.work_item || this.workItem;
    if (!workItem) {
      this.toastr.error('Work item is missing.');
      return;
    }

    this.isLoading = true;

    this.dataService.getDocumentAnalysis(this.processRefId, stepName, this.workItem, this.sourceRefId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Document Analysis Response:', response);

        if (response && response.status === 'success') {
          if (response.data && Array.isArray(response.data)) {
            this.documentList = response.data;
          } else if (response.data) {
            this.documentList = [response.data];
          } else {
            this.documentList = [];
          }
          this.showDocumentPopup = true;
        } else if (response && response.data) {
          if (Array.isArray(response.data)) {
            this.documentList = response.data;
          } else {
            this.documentList = [response.data];
          }
          this.showDocumentPopup = true;
        } else {
          this.toastr.warning('No document analysis data available.');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error fetching document analysis:', error);

        if (error.status === 404) {
          this.toastr.error('Document analysis data not found.');
        } else if (error.status === 500) {
          this.toastr.error('Server error while fetching document analysis.');
        } else {
          this.toastr.error('Failed to fetch document analysis data.');
        }
      }
    });
  }

  closeDocumentPopup() {
    this.showDocumentPopup = false;
    this.isEditMode = false;
    this.availableDocuments = [];
    this.selectedSourceDocument = '';
    this.selectedTargetDocuments = [];
  }

  openEditMode() {
    if (!this.sourceRefId) {
      this.toastr.error('Source reference ID is missing.');
      return;
    }

    this.isLoading = true;

    this.dataService.getDocsFilesForEdit(
      this.sourceRefId,
      this.modelDestinationLob || this.workItem,
      this.workItem
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Edit Docs Response:', response);

        if (response && response.status === 'success' && response.data) {
          if (Array.isArray(response.data)) {
            this.availableDocuments = response.data;
          } else {
            this.availableDocuments = [response.data];
          }
          this.isEditMode = true;
        } else if (response && response.data) {
          if (Array.isArray(response.data)) {
            this.availableDocuments = response.data;
          } else {
            this.availableDocuments = [response.data];
          }
          this.isEditMode = true;
        } else {
          this.toastr.warning('No documents available for editing.');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error fetching edit documents:', error);
        this.toastr.error('Failed to load documents for editing.');
      }
    });
  }

  addTargetDocument() {
    this.selectedTargetDocuments.push('');
  }

  removeTargetDocument(index: number) {
    this.selectedTargetDocuments.splice(index, 1);
  }

  saveDocumentChanges() {
    if (!this.selectedSourceDocument) {
      this.toastr.error('Please select a source document.');
      return;
    }

    const validTargets = this.selectedTargetDocuments.filter(doc => doc && doc.trim() !== '');
    if (validTargets.length === 0) {
      this.toastr.error('Please select at least one target document.');
      return;
    }

    this.isLoading = true;

    this.dataService.saveBaseTarget(
      this.sourceRefId,
      this.selectedSourceDocument,
      validTargets,
      this.workItem
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Save Response:', response);

        if (response && response.status === 'success') {
          this.toastr.success('Documents saved successfully.');
          this.isEditMode = false;
          this.selectedSourceDocument = '';
          this.selectedTargetDocuments = [];
        } else {
          this.toastr.success('Documents saved.');
          this.isEditMode = false;
          this.selectedSourceDocument = '';
          this.selectedTargetDocuments = [];
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error saving documents:', error);
        this.toastr.error('Failed to save document changes.');
      }
    });
  }

  downloadChecklist() {
    if (!this.processRefId) {
      this.toastr.error('Process reference ID missing.');
      return;
    }
    this.isLoading = true;

    this.dataService.downloadChecklist(this.processRefId).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `final_${this.processRefId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.isLoading = false;
        this.toastr.success('Checklist downloaded successfully.');
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.toastr.error('Checklist not yet generated for this process.');
        } else {
          this.toastr.error('Failed to download checklist.');
        }
        console.error('Download error:', error);
      }
    });
  }

  shouldShowDownloadButton(step: Step): boolean {
    const stepName = step.step?.toLowerCase() || '';
    return stepName.includes('generate checklist') && step.status === 'done';
  }

  private mapStepsToStepper(rawSteps: any[], workflowKey: string): Step[] {
    const workflowSteps = WORKFLOWS[workflowKey] || [];
    const stepsMap: { [key: string]: any } = {};
    rawSteps.forEach(step => {
      if (step.step_name) {
        stepsMap[step.step_name.toLowerCase()] = step;
      }
    });

    const documentDownloadStep = stepsMap['document download'];
    const extractMetadataStep = stepsMap['extract metadata'];
    const documentClassificationStep = stepsMap['document classification'];
    const documentAnalysisStep = stepsMap['document analysis'];
    const sendCOIStep = stepsMap['send coi document'] || 
                      stepsMap['send coi documents'] || 
                      stepsMap['send coi doc'] ||
                      stepsMap['send coi'] ||
                      Object.values(stepsMap).find(step => 
                        step.step_name?.toLowerCase().includes('send') && 
                        step.step_name?.toLowerCase().includes('coi')
                      );

    const stepper: Step[] = [];

    if (workflowKey === 'policy_checking' || workflowKey === 'policy checking') {
      // POLICY CHECKING WORKFLOW
      
      workflowSteps.forEach((stepName, index) => {
        let status: Step['status'] = 'pending';
        let message = '';

        switch (stepName.toLowerCase()) {
          case 'read input files':
            if (rawSteps.length === 0) {
              // No steps in DB yet
              status = 'inprogress';
              message = 'Starting to read input files';
            } else if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus === 'in progress') {
                // Document Download is in progress → Blue
                status = 'inprogress';
                message = 'Reading input files';
              } else {
                // Document Download is NOT in progress (completed/failed/anything else) → Green
                status = 'done';
                message = 'Input files read successfully';
              }
            } else {
              // Some steps exist but no Document Download yet
              status = 'inprogress';
              message = 'Reading input files';
            }
            break;

          case 'extract metadata':
            if (extractMetadataStep) {
              const metadataStatus = extractMetadataStep.step_status?.toLowerCase();
              if (metadataStatus === 'in progress') {
                // Extract Metadata step is in progress → Blue
                status = 'inprogress';
                message = 'Extracting metadata from documents';
              } else {
                // Extract Metadata step is NOT in progress → Green
                status = 'done';
                message = 'Metadata extraction completed';
              }
            } else {
              // No Extract Metadata step yet - check if previous step (Read Input Files) is completed
              if (documentDownloadStep && documentDownloadStep.step_status?.toLowerCase() !== 'in progress') {
                // Document Download completed → Auto-start Extract Metadata as in progress
                status = 'inprogress';
                message = 'Extracting metadata from documents';
              } else {
                status = 'pending';
                message = 'Waiting for document download to complete';
              }
            }
            break;

          case 'classify documents':
            if (documentClassificationStep) {
              const classificationStatus = documentClassificationStep.step_status?.toLowerCase();
              if (classificationStatus === 'in progress') {
                // Document Classification is in progress → Blue
                status = 'inprogress';
                message = documentClassificationStep.comments || 'Classifying documents';
              } else {
                // Document Classification is NOT in progress → Green
                status = 'done';
                message = 'Document classification completed';
              }
            } else {
              // No Document Classification step yet
              status = 'pending';
              message = 'Waiting for document classification to start';
            }
            break;

          case 'generate checklist':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus === 'in progress') {
                // Document Analysis is in progress → Blue
                status = 'inprogress';
                message = 'Generating checklist';
              } else {
                // Document Analysis is NOT in progress → Green
                status = 'done';
                message = 'Checklist generated successfully';
              }
            } else {
              // No Document Analysis step yet
              status = 'pending';
              message = 'Waiting for document analysis';
            }
            break;

          case 'upload checklist to target system':
            // Automatically marked as completed when Generate Checklist becomes completed
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus !== 'in progress') {
                // Document Analysis is NOT in progress → Green (auto-complete)
                status = 'done';
                message = 'Checklist uploaded to target system';
              } else {
                status = 'pending';
                message = 'Waiting for checklist generation to complete';
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
      // COI WORKFLOW
      
      workflowSteps.forEach((stepName, index) => {
        let status: Step['status'] = 'pending';
        let message = '';

        switch (stepName.toLowerCase()) {
          case 'read input files':
            if (rawSteps.length === 0) {
              // No steps in DB yet
              status = 'inprogress';
              message = 'Starting to read input files';
            } else if (documentDownloadStep) {
              const downloadStatus = documentDownloadStep.step_status?.toLowerCase();
              if (downloadStatus === 'in progress') {
                // Document Download is in progress → Blue
                status = 'inprogress';
                message = 'Reading input files';
              } else {
                // Document Download is NOT in progress (completed/failed/anything else) → Green
                status = 'done';
                message = 'Input files read successfully';
              }
            } else {
              // Some steps exist but no Document Download yet
              status = 'inprogress';
              message = 'Reading input files';
            }
            break;

          case 'extract metadata':
            if (documentAnalysisStep) {
              const analysisStatus = documentAnalysisStep.step_status?.toLowerCase();
              if (analysisStatus === 'in progress') {
                // Document Analysis is in progress → Blue
                status = 'inprogress';
                message = 'Extracting metadata from documents';
              } else {
                // Document Analysis is NOT in progress → Green
                status = 'done';
                message = 'Metadata extraction completed';
              }
            } else {
              // No Document Analysis step yet - check if previous step (Read Input Files) is completed
              if (documentDownloadStep && documentDownloadStep.step_status?.toLowerCase() !== 'in progress') {
                // Document Download completed → Auto-start Extract Metadata as in progress
                status = 'inprogress';
                message = 'Extracting metadata from documents';
              } else {
                status = 'pending';
                message = 'Waiting for document download to complete';
              }
            }
            break;

          case 'generate coi':
            if (sendCOIStep) {
              const sendCOIStatus = sendCOIStep.step_status?.toLowerCase();
              if (sendCOIStatus === 'in progress') {
                // Send COI Document is in progress → Blue
                status = 'inprogress';
                message = 'Generating COI document';
              } else {
                // Send COI Document is NOT in progress → Green
                status = 'done';
                message = 'COI document generated successfully';
              }
            } else {
              // No Send COI Document step yet - check if previous step (Extract Metadata) is completed
              if (documentAnalysisStep && documentAnalysisStep.step_status?.toLowerCase() !== 'in progress') {
                // Document Analysis completed → Auto-start Generate COI as in progress
                status = 'inprogress';
                message = 'Generating COI document';
              } else {
                status = 'pending';
                message = 'Waiting for document analysis to complete';
              }
            }
            break;

          case 'email to requestor':
            // Automatically marked as completed when Generate COI becomes completed
            if (sendCOIStep) {
              const sendCOIStatus = sendCOIStep.step_status?.toLowerCase();
              if (sendCOIStatus !== 'in progress') {
                // Send COI Document is NOT in progress → Green (auto-complete)
                status = 'done';
                message = sendCOIStep.comments || 'COI email sent successfully';
              } else {
                status = 'pending';
                message = 'Waiting for COI generation to complete';
              }
            } else {
              // No Send COI Document step yet
              status = 'pending';
              message = 'Waiting for COI generation to complete';
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
      return this.mapGenericStepsToStepper(rawSteps, workflowSteps);
    }

    return stepper;
  }

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
      this.workItem = params.get('work_item')?.toLowerCase() || '';
      this.sourceRefId = params.get('source_id') || '';
      if (this.processRefId) {
        this.loadSteps();
      } 
    });
  }

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
            const workflowKey = this.workItem === 'policy checking' ? 'policy_checking' : this.workItem;
            this.workFlow = this.mapStepsToStepper(response, workflowKey);
            this.isLoading = false;
            return;
          }
          this.steps = [];
          this.isLoading = false;
        },
      error: (error) => {
        this.toastr.error('Event found with no steps yet'); 
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

  getStatusIcon(status: string): string {
    if (!status) return 'help_outline';
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
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['process_ref_id'];
    delete queryParams['work_item'];
    this.router.navigate(['/layout/details'], {
      queryParams: queryParams
    });
  }

  onRefresh() {
    this.loadSteps();
  }

  trackByIndex(index: number): number {
    return index;
  }
}