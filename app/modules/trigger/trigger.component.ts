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
    'Policy Renewal'
  ];

  clients: string[] = ['Wellhouse', 'Symphony', 'Base'];
  clientDisplayNames: { [key: string]: string } = {
    Wellhouse: 'Wellhouse Company',
    Symphony: 'Symphony Risk Solutions',
    Base: 'Base'
  };

  constructor(private dataService: DataService, private router: Router) {}

  triggerStepper() {
    if (!this.selectedOption || !this.selectedClient) {
      console.warn('Please select both process and client first.');
      return;
    }

    const apiCall =
      this.selectedClient === 'Base'
        ? this.dataService.triggerBaseTenant(this.selectedOption, this.selectedClient)
        : this.dataService.triggerBot1(this.selectedOption, this.selectedClient);

    apiCall.subscribe({
      next: (res) => {
        console.log('Trigger response:', res);

        // Generate current date in MM-dd-yyyy format
        const today = new Date();
        const startDate = this.formatDate(today);
        const endDate = this.formatDate(today);

        this.dataService.setDashboardState(startDate, endDate, this.selectedClient);

        const success = (res?.status || '').toLowerCase() === 'success' ? '1' : '0';

        // Navigate to details page
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
        console.error('Failed to trigger process:', err);
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
