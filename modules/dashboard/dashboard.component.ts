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
  
  // Metrics data for the new UI
  metricsData = [
    {
      type: 'Received',
      title: 'Received',
      value: 0,
      description: 'Total documents received for processing',
      trend: 5.2,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      type: 'Policy_Checking',
      title: 'Policy Checking',
      value: 0,
      description: 'Documents under policy verification',
      trend: -2.1,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
        <polyline points="10,9 9,10 8,9" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      type: 'COI',
      title: 'Certificate of Insurance',
      value: 0,
      description: 'COI documents being processed',
      trend: 8.7,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22S8 18 8 13V7L12 5L16 7V13C16 18 12 22 12 22Z" stroke="currentColor" stroke-width="2"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      type: 'Carrier_Download',
      title: 'Carrier Download',
      value: 0,
      description: 'Documents downloaded from carriers',
      trend: 3.4,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15V19C21 19.5 20.5 20 20 20H4C3.5 20 3 19.5 3 19V15" stroke="currentColor" stroke-width="2"/>
        <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
      </svg>`
    },
    {
      type: 'New_Renewal',
      title: 'New Renewal',
      value: 0,
      description: 'New renewal applications processed',
      trend: 12.3,
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="2"/>
        <polyline points="1 20 1 14 7 14" stroke="currentColor" stroke-width="2"/>
        <path d="M20.49 9C19.9 5.5 16.9 3 13.5 3C9.8 3 6.8 5.4 6.2 8.5" stroke="currentColor" stroke-width="2"/>
        <path d="M3.51 15C4.1 18.5 7.1 21 10.5 21C14.2 21 17.2 18.6 17.8 15.5" stroke="currentColor" stroke-width="2"/>
      </svg>`
    }
  ];

  // counts for tiles
  receivedCount: number = 0;
  policyCheckCount: number = 0;
  coiCount: number = 0;
  carrierDownload: number = 0;
  newRenewalCount: number = 0;

  // dropdown
  projects: string[] = [];
  clients: string[] = [];
  selectedProject: string = '';
  defaultClient: string = '';

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

    if (!startDate || !endDate) {
      // First time after login → set default last 5 days
      const today = new Date();
      const fiveDaysAgo = new Date(today);
      fiveDaysAgo.setDate(today.getDate() - 5);

      this.startDateCtrl.setValue(fiveDaysAgo);
      this.endDateCtrl.setValue(today);

      this.DataService.setDashboardState(
        this.formatDateForAPI(fiveDaysAgo),
        this.formatDateForAPI(today)
      );
    } else {
      // Restore from saved state
      this.startDateCtrl.setValue(new Date(startDate));
      this.endDateCtrl.setValue(new Date(endDate));
      this.selectedProject = client || '';
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

      // 🔹 Save the state whenever data is fetched
      this.DataService.setDashboardState(startDate, endDate, this.selectedProject);

      this.loading = true;
      const apiCall = this.selectedProject
        ? this.DataService.getDashboardMetrics(startDate, endDate, this.selectedProject)
        : this.DataService.getDashboardMetrics(startDate, endDate);

      apiCall.subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res) {
            this.clients = res.clients || [];
            this.projects = res.clients || [];
            this.defaultClient = res.default_client || '';

            if (!this.selectedProject && this.defaultClient) {
              this.selectedProject = this.defaultClient;
            }

            const allMetrics = res.metrics || {};
            const clientMetrics = allMetrics[this.selectedProject] || {};

            this.receivedCount = clientMetrics.Received || 0;
            this.policyCheckCount = clientMetrics.Policy_Check || 0;
            this.coiCount = clientMetrics.COI || 0;
            this.carrierDownload = clientMetrics.Carrier_Download || 0;
            this.newRenewalCount = clientMetrics.New_Renewal || 0;
            
            // Update metrics data
            this.updateMetricsData();
          } else {
            this.toastNotificationService.showError(
              res?.message || 'No data received',
              'Error'
            );
          }
        },
        error: () => {
          this.loading = false;
          this.toastNotificationService.showError(
            'Select different date range',
            'No data found'
          );
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
  
  private updateMetricsData(): void {
    this.metricsData[0].value = this.receivedCount;
    this.metricsData[1].value = this.policyCheckCount;
    this.metricsData[2].value = this.coiCount;
    this.metricsData[3].value = this.carrierDownload;
    this.metricsData[4].value = this.newRenewalCount;
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
    this.fetchDashboardData();
  }

  onClientChange(): void {
    this.fetchDashboardData();
  }
}
