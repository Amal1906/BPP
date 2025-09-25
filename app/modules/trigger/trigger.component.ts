import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-trigger',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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

      // Generate current date in MM-dd-yyyy format
      const today = new Date();
      const startDate = this.formatDate(today);
      const endDate = this.formatDate(today);

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

  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

}
