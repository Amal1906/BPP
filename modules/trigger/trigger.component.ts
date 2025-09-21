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
    'Policy Checking',
    'COI',
    'Carrier Download',
    'New Renewal'
  ];

  clients: string[] = ['Wellhouse', 'Symphony']; 

  constructor(private dataService: DataService, private router: Router) {}

  triggerStepper() {
    if (!this.selectedOption || !this.selectedClient) {
      console.warn('Please select both process and client first.');
      return;
    }

    this.dataService.triggerBot1(this.selectedOption, this.selectedClient).subscribe({
      next: (res) => {
        console.log('Bot1 triggered:', res);

        const startDate = res.startDate;
        const endDate = res.endDate;

        this.dataService.setDashboardState(startDate, endDate, this.selectedClient); 

        const success = (res?.status || '').toLowerCase() === 'success' ? '1' : '0';

        this.router.navigate(['/layout/details'], {
          queryParams: {
            process_type: this.selectedOption,
            client: this.selectedClient,
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
