import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService } from '../service/transactions.service';
import { ToastNotificationService } from '../../shared/service/others/toast-notifcation.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../service/data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatGridListModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatNativeDateModule,
  ],
})
export class DashboardComponent implements OnInit {
  loading: boolean = false;
  gridCols: number = 4;

  // counts for tiles
  receivedCount: number = 0;
  policyCheckCount: number = 0;
  coiCount: number = 0;
  carrierDownload: number = 0;
  newRenewalCount: number = 0;

  // PREDEFINED CLIENTS - No longer fetched from API
  clients: string[] = ['Wellhouse', 'Symphony'];
  projects: string[] = ['Wellhouse', 'Symphony']; // Keep for backward compatibility
  selectedProject: string = 'Wellhouse'; // Default to Wellhouse
  defaultClient: string = 'Wellhouse';

  // date handling
  isDateCleared: boolean = false;
  isInvalidDateRange = false;
  maxDate = new Date();
  today: Date = new Date();
  todayEnd: Date = new Date();

  startDateCtrl: FormControl = new FormControl(null, Validators.required);
  endDateCtrl: FormControl = new FormControl(null, Validators.required);

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private transactionsService: TransactionsService,
    private DataService: DataService,
    private toastNotificationService: ToastNotificationService,  
  ) {
    // responsive layout
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.gridCols = 1;
          } else if (result.breakpoints[Breakpoints.Small]) {
            this.gridCols = 2;
          } else if (result.breakpoints[Breakpoints.Medium]) {
            this.gridCols = 3;
          } else {
            this.gridCols = 4;
          }
        }
      });

    this.maxDate.setDate(this.maxDate.getDate() + 1);
  }

  ngOnInit(): void {
    const { startDate, endDate, client } = this.DataService.getDashboardState();

    // Set default client if saved state doesn't have one
    if (client && this.clients.includes(client)) {
      this.selectedProject = client;
    } else {
      this.selectedProject = 'Wellhouse'; // Always default to Wellhouse
    }

    if (!startDate || !endDate) {
      // First time after login → set default last 5 days
      const today = new Date();
      const fiveDaysAgo = new Date(today);
      fiveDaysAgo.setDate(today.getDate() - 5);

      this.startDateCtrl.setValue(fiveDaysAgo);
      this.endDateCtrl.setValue(today);

      this.DataService.setDashboardState(
        this.formatDateForAPI(fiveDaysAgo),
        this.formatDateForAPI(today),
        this.selectedProject
      );
    } else {
      // Restore from saved state
      this.startDateCtrl.setValue(new Date(startDate));
      this.endDateCtrl.setValue(new Date(endDate));
    }

    this.fetchDashboardData();
  }

  private formatDateForAPI(date: Date): string {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  fetchDashboardData(): void {
    if (this.startDateCtrl.valid && this.endDateCtrl.valid) {
      const startDate = this.formatDateForAPI(this.startDateCtrl.value);
      const endDate = this.formatDateForAPI(this.endDateCtrl.value);

      // Save the state whenever data is fetched
      this.DataService.setDashboardState(startDate, endDate, this.selectedProject);

      this.loading = true;

      // Always pass the selected client to the API
      this.DataService.getDashboardMetrics(startDate, endDate, this.selectedProject).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res) {
            // Use the response metrics for the selected client
            const allMetrics = res.metrics || {};
            const clientMetrics = allMetrics[this.selectedProject] || {};

            this.receivedCount = clientMetrics.Received || 0;
            this.policyCheckCount = clientMetrics.Policy_Check || 0;
            this.coiCount = clientMetrics.COI || 0;
            this.carrierDownload = clientMetrics.Carrier_Download || 0;
            this.newRenewalCount = clientMetrics.New_Renewal || 0;

            console.log(`Dashboard data loaded for client: ${this.selectedProject}`, clientMetrics);
          } else {
            this.toastNotificationService.showError(
              res?.message || 'No data received',
              'Error'
            );
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Dashboard API Error:', err);
          this.toastNotificationService.showError(
            'Select different date range or try again',
            'No data found'
          );
          // Reset counts on error
          this.resetCounts();
        },
      });
    } else {
      this.isInvalidDateRange = true;
      this.toastNotificationService.showError(
        'Please select valid start and end dates.',
        'Invalid Dates'
      );
    }
  }

  private resetCounts(): void {
    this.receivedCount = 0;
    this.policyCheckCount = 0;
    this.coiCount = 0;
    this.carrierDownload = 0;
    this.newRenewalCount = 0;
  }

  goToDetails(processType: string) {
    if (!this.startDateCtrl.value || !this.endDateCtrl.value) {
      this.toastNotificationService.showError(
        'Please select valid start and end dates.',
        'Invalid Dates'
      );
      return;
    }

    if (!this.selectedProject) {
      this.toastNotificationService.showError(
        'Please select a client/project.',
        'Client Required'
      );
      return;
    }

    // Format dates for backend API
    const startDate = this.formatDateForAPI(this.startDateCtrl.value);
    const endDate = this.formatDateForAPI(this.endDateCtrl.value);

    // Save state before navigating
    this.DataService.setDashboardState(startDate, endDate, this.selectedProject);

    // Build query params to pass to Details page
    const queryParams: any = {
      start_date: startDate,
      end_date: endDate,
      client: this.selectedProject,
      process_type: processType,
    };

    console.log('Navigating to details with params:', queryParams);
    this.router.navigate(['/layout/details'], { queryParams });
  }

  // ---- Navigation ----
  private navigateTo(metric: string) {
    this.loading = true;
    const queryParams: any = {};
    const startDate = this.startDateCtrl.value;
    const endDate = this.endDateCtrl.value;

    if (startDate && endDate) {
      queryParams.startDate = this.formatDateForAPI(startDate);
      queryParams.endDate = this.formatDateForAPI(endDate);
      queryParams.client = this.selectedProject;
      queryParams.metric = metric;
    } else if (this.isDateCleared) {
      queryParams.isDateCleared = this.isDateCleared;
      queryParams.client = this.selectedProject;
      queryParams.metric = metric;
    }

    // Save state before navigating
    if (startDate && endDate) {
      this.DataService.setDashboardState(
        this.formatDateForAPI(startDate),
        this.formatDateForAPI(endDate),
        this.selectedProject
      );
    }

    this.router.navigate(['/layout/details'], { queryParams });
  }

  navigateToReceived() {
    this.navigateTo('Received');
  }

  navigateToPolicyCheck() {
    this.navigateTo('Policy_Checking');
  }

  navigateToCoi() {
    this.navigateTo('COI');
  }

  navigateToCarrierDownload() {
    this.navigateTo('Carrier_Download');
  }

  navigateToNewRenewal() {
    this.navigateTo('New_Renewal');
  }

  clearDateRange() {
    this.startDateCtrl.reset();
    this.endDateCtrl.reset();
    this.isDateCleared = true;
    this.isInvalidDateRange = false;
    this.resetCounts();
    this.fetchDashboardData();
  }

  // CLIENT CHANGE HANDLER - This will trigger when dropdown changes
  onClientChange(): void {
    console.log(`Client changed to: ${this.selectedProject}`);
    
    // Save the new client selection
    const startDate = this.formatDateForAPI(this.startDateCtrl.value);
    const endDate = this.formatDateForAPI(this.endDateCtrl.value);
    this.DataService.setDashboardState(startDate, endDate, this.selectedProject);
    
    // Fetch new data for the selected client
    this.fetchDashboardData();
  }
}