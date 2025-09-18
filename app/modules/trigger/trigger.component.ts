import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { end } from '@popperjs/core';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent {
  selectedOption: string = '';

  options: string[] = [
    'Policy_Checking_traditional',
    'Policy_Checking_llm',
    'COI',
    'Carrier_Download',
    'New_Renewal'
  ];

  constructor(private dataService: DataService, private router: Router) {}

 
  triggerStepper() {
  if (!this.selectedOption) {
    console.warn('Please select an option first.');
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
