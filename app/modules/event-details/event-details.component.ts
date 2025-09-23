import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { FormatDataTimePipe } from '../../data/pipe/format-date-time.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DataService } from '../service/data.service';
import { EventDetailsActionComponent } from './event-details-action/event-details-action.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CommonService } from '../../shared/service/common/common.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [
    AgGridAngular,
    AgGridModule,
    MatIcon,
    CommonModule,
    MatTooltip,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    LoaderComponent,
    FormsModule,
  ],
  providers: [FormatDataTimePipe, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EventDetailsComponent implements OnInit {
  @ViewChild('InputVar', { static: false }) InputVar!: ElementRef;

  public gridApi!: GridApi;
  public rowData: any[] = [];
  public filteredRowData: any[] = [];
  selectedCategory: string = '';
  tenantId: string = '';
  isLoading: boolean = false;
  currentDate = new Date();
  searchTerm: string = '';
  public noRowsTemplate = `<span class="ag-overlay-no-rows-center">No data found</span>`;
  selectedClient: string = '';  
  //clientOptions: string[] = ['Wellhouse', 'Symphony'];  

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required)
  });

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private formatDateTimePipe: FormatDataTimePipe,
    private toastr: ToastrService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title
  ) {}

  public columnDefs: ColDef[] = [
    { headerName: 'Source', field: 'source', width: 120, tooltipField: 'source', maxWidth: 500 },
    { headerName: 'Source Reference ID', field: 'source_ref_id', tooltipField: 'source_ref_id', flex: 1.2, maxWidth: 500 },
    { headerName: 'Customer', field: 'client', width: 150, tooltipField: 'client', maxWidth: 500 },
    { headerName: 'Work Type', field: 'process_type', width: 150, tooltipField: 'process_type', maxWidth: 500 },
    { headerName: 'Process Reference ID', field: 'process_ref_id', tooltipField: 'process_ref_id', maxWidth: 500 },
    {
      headerName: 'Created Date',
      width: 180,
      valueGetter: (params) =>
        this.formatDateTimePipe.transform(params.data.created_date, 'MM-dd-yyyy'),
      resizable: true,
      tooltipValueGetter: (params) =>
        this.formatDateTimePipe.transform(params.data.created_date, 'MM-dd-yyyy, HH:mm:ss'),
      maxWidth: 500,
      sortable: true,
      sort: 'desc',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 200,
      cellRenderer: (params: any) => this.statusRenderer(params),
      tooltipValueGetter: (params) => {
        if (!params.data.latest_step_name || !params.data.latest_step_status) {
          return 'No steps added';
        }
        return `${params.data.latest_step_name}: ${params.data.latest_step_status}`;
      },
      maxWidth: 220,
      minWidth: 220
    },
    {
      headerName: 'Action',
      field: 'actions',
      cellRenderer: EventDetailsActionComponent,
      filter: false,
      flex: 0.5,
      resizable: false,
      maxWidth: 100,
      minWidth: 100
    }
  ];

  public gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    suppressMovableColumns: true,
    tooltipShowDelay: 0,
    tooltipHideDelay: 8000,
    tooltipInteraction: true,
    enableCellTextSelection: true,
  };

  public defaultColDef: ColDef | any = {
    flex: 1,
    filter: 'agTextColumnFilter',
    sortable: false,
  };

  ngOnInit(): void {
    this.titleService.setTitle('Transaction Dashboard');

    this.route.queryParams.subscribe(params => {
      const startParam = params['start_date'];
      const endParam = params['end_date'];
      const client = params['client'];        
      const processType = params['process_type'];

      const parseMDY = (s: string) => {
        const parts = s?.split('-');
        if (!parts || parts.length !== 3) return new Date('Invalid');
        const [mmStr, ddStr, yyyyStr] = parts;
        const mm = Number(mmStr);
        const dd = Number(ddStr);
        const yyyy = Number(yyyyStr);
        return new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, 0, 0, 0);
      };

      const parseISOish = (s: string) => {
        if (!s) return new Date('Invalid');
        const d = new Date(s);          
        if (!isNaN(d.getTime())) return d;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
          return new Date(`${s}T00:00:00`);
        }
        return new Date('Invalid');
      };

      const toDate = (s?: string) => {
        if (!s) return null;
        const iso = parseISOish(s);
        if (!isNaN(iso.getTime())) return iso;
        const mdy = parseMDY(s);
        return !isNaN(mdy.getTime()) ? mdy : null;
      };

      const startAsDate = toDate(startParam);
      const endAsDate = toDate(endParam);

      if (client) {
        this.selectedClient = client;
      } else {
        this.selectedClient = 'Wellhouse';
      }

      if (startAsDate && endAsDate) {
        const start = new Date(
          startAsDate.getFullYear(),
          startAsDate.getMonth(),
          startAsDate.getDate(),
          0, 0, 0
        );
        const end = new Date(
          endAsDate.getFullYear(),
          endAsDate.getMonth(),
          endAsDate.getDate(),
          23, 59, 59
        );

        this.dateRange.patchValue({ start, end }, { emitEvent: false });
        this.commonService.setDate({ start, end });

        if (this.selectedClient && processType) {
          const startForApi = this.formatDateTimePipe.transform(start.toString(), 'MM-dd-yyyy');
          const endForApi = this.formatDateTimePipe.transform(end.toString(), 'MM-dd-yyyy');
          this.getTileEventDetails(startForApi, endForApi, this.selectedClient, processType);
        } else {
          this.loadDashboardData();
        }
        
        return;
      }

      this.commonService.selectedDate$
        .pipe(takeUntil(this.destroy$))
        .subscribe(dates => {
          if (dates.start && dates.end) {
            this.dateRange.patchValue(
              { start: dates.start, end: dates.end },
              { emitEvent: false }
            );
          } else {
            const defaultStart = new Date();
            defaultStart.setDate(defaultStart.getDate() - 3);
            this.dateRange.patchValue(
              { start: defaultStart, end: new Date() },
              { emitEvent: false }
            );
          }
          this.loadDashboardData();
        });
    });

    // Listen for client changes and reload data
    // this.commonService.selectedClient$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(client => {
    //     if (client) {
    //       this.selectedClient = client;
    //       const { start, end } = this.dateRange.value;
    //       if (start && end) {
    //         const startDate = this.formatDateTimePipe.transform(start.toString(), 'MM-dd-yyyy');
    //         const endDate = this.formatDateTimePipe.transform(end.toString(), 'MM-dd-yyyy');
    //         this.dataService.getProcessStatus(startDate, endDate, this.selectedClient).subscribe({
    //           next: (response: any) => {
    //             this.rowData = Array.isArray(response) ? response : [];
    //             this.filteredRowData = [...this.rowData];
    //             this.isLoading = false;
    //           },
    //           error: () => {
    //             this.toastr.error('Error loading data for client');
    //             this.isLoading = false;
    //           }
    //         });
    //       }
    //     }
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement?.value.trim().toLowerCase() || '';
    if (!this.searchTerm) {
      this.filteredRowData = [...this.rowData];
      return;
    }
    this.filteredRowData = this.rowData.filter(item => {
      return Object.keys(item).some(key => {
        if (key === 'actions') return false;
        const created_date = this.formatDateTimePipe.transform(item.created_date) || '';
        const value = item[key]?.toString().toLowerCase() || '';
        return (value.includes(this.searchTerm) || created_date.includes(this.searchTerm));
      });
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredRowData = [...this.rowData];
    if (this.InputVar) {
      this.InputVar.nativeElement.value = '';
    }
  }

  reset() {
    this.selectedCategory = '';
    this.clearSearch();
    this.gridApi.setFilterModel(null);
  }

  refresh(): void {
    this.clearSearch();
    this.gridApi.setFilterModel(null);
    this.filteredRowData = [];
    this.loadDashboardData();
  }

  handleDateChange() {
    if (!this.dateRange.valid) return;
    const { start, end } = this.dateRange.value;
    if (!start || !end) return;
    this.commonService.setDate({ start, end });
    this.loadDashboardData();
  }

  clearDate() {
    this.dateRange.reset();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    const { start, end } = this.dateRange.value;
    this.rowData = [];
    this.filteredRowData = [];

    if (!start || !end) {
      this.isLoading = false;
      if (this.gridApi) this.gridApi.showNoRowsOverlay();
      return;
    }

    const startDate = this.formatDateTimePipe.transform(start.toString(), 'MM-dd-yyyy');
    const endDate = this.formatDateTimePipe.transform(end.toString(), 'MM-dd-yyyy');

    this.dataService.getProcessStatus(startDate, endDate, this.selectedClient).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.rowData = response;
          console.log('Dashboard Data Response:', response);
          this.filteredRowData = [...response];
        } else if (response.status === 'error') {
          this.toastr.error(response.message);
          if (this.gridApi) this.gridApi.showNoRowsOverlay();
        }
        this.isLoading = false;
      },
      error: (err) => {
        let errorMessage = 'Error loading process data';
        if (err.error?.message) errorMessage = err.error.message;
        this.toastr.error(errorMessage);
        this.filteredRowData = [];
        this.isLoading = false;
      }
    });
  }

  getTileEventDetails(startDate: string, endDate: string, client: string, processType: string) {
    this.isLoading = true;
    this.dataService.getTileEventDetails(startDate, endDate, client, processType).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.rowData = response;
          this.filteredRowData = [...response];
        } else if (response.status === 'error') {
          this.toastr.error(response.message);
          this.rowData = [];
          this.filteredRowData = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        let errorMessage = 'Error fetching tile details';
        if (err.error?.message) errorMessage = err.error.message;
        this.toastr.error(errorMessage);
        this.rowData = [];
        this.filteredRowData = [];
        this.isLoading = false;
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  statusRenderer(params: any) {
    if (!params.value) {
      return `<div class="content-badge default"> • No Status </div>`;
    }
    const normalizedStatus = params.value.toLowerCase();
    let statusText = params.value;
    let statusClass = 'default';
    if (normalizedStatus == 'started' || normalizedStatus == 'completed' || normalizedStatus == 'new') {
      statusClass = 'active';
    } else if (normalizedStatus == 'failed') {
      statusClass = 'inactive';
    } else if (normalizedStatus == 'in progress' || normalizedStatus == 'pending' || normalizedStatus == 'partially completed') {
      statusClass = 'pending';
    }
    return `<div class="content-badge ${statusClass}"> • ${statusText}</div>`;
  }
//   onClientChange(client: string) {
//   this.selectedClient = client;
//   this.commonService.setClient(client);

//   // reload dashboard with the new client + current date range
//   const { start, end } = this.dateRange.value;
//   if (start && end) {
//     const startDate = this.formatDateTimePipe.transform(start.toString(), 'MM-dd-yyyy');
//     const endDate = this.formatDateTimePipe.transform(end.toString(), 'MM-dd-yyyy');
//     this.dataService.getProcessStatus(startDate, endDate, client).subscribe({
//       next: (response: any) => {
//         this.rowData = Array.isArray(response) ? response : [];
//         this.filteredRowData = [...this.rowData];
//         this.isLoading = false;
//       },
//       error: () => {
//         this.toastr.error('Error loading data for client');
//         this.isLoading = false;
//       }
//     });
//   }
// }

}
