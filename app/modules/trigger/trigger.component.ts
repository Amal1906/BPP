import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent {
  selectedOption: string = '';
  selectedClient: string = '';

  options: string[] = [
    'Policy_Checking_traditional',
    'Policy_Checking_llm',
    'COI',
    'Carrier_Download',
    'New_Renewal'
  ];
  
  clients: string[] = [
    'Wellhouse',
    'Symphony'
  ];

  constructor(private dataService: DataService, private router: Router) {}

  triggerStepper() {
    if (!this.selectedOption || !this.selectedClient) {
      console.warn('Please select both process and client.');
      return;
    }

    // Get current date for start and end date
    const currentDate = new Date();
    const startDate = this.formatDate(currentDate);
    const endDate = this.formatDate(currentDate);

    // Save state
    this.dataService.setDashboardState(startDate, endDate, this.selectedClient);

    // Navigate to details page with query params
    this.router.navigate(['/layout/details'], {
      queryParams: {
        process_type: this.selectedOption,
        client: this.selectedClient,
        start_date: startDate,
        end_date: endDate,
        success: '1' // Assuming successful trigger
      }
    });
  }

  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
}

    return;
  }

  this.dataService.triggerBot1(this.selectedOption).subscribe({
    next: (res) => {
      console.log('Bot1 triggered:', res);

      // Save start & end dates into datepicker state
      const startDate = res.startDate; // already ISO string
      const endDate = res.endDate;

      this.dataService.setDashboardState(startDate, endDate);

      // Redirect with query params (ISO strings)
      const success = (res?.status || '').toLowerCase() === 'success' ? '1' : '0';
      this.router.navigate(['/layout/details'], {
        queryParams: {
          process_type: this.selectedOption,
          start_date: startDate,
          end_date: endDate,
          success
        }
      });
    },
    error: (err) => {
      console.error('Failed to trigger Bot1:', err);
    }
  });
  }
}
