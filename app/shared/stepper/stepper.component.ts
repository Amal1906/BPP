import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  step: string;
  status: 'pending' | 'inprogress' | 'done' | 'failed';
  status_message?: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  @Input() workFlow: Step[] = [];
  @Input() loading = false;

getStepClass(item: Step): string {
  const status = item?.status?.toLowerCase();
  console.log('Step:', item.step, 'Status:', status);
  switch (status) {
    case 'done':
      return 'stepper__step--done';
    case 'inprogress':
      return 'stepper__step--inprogress';
    case 'failed':
      return 'stepper__step--failed';
    default:
      return 'stepper__step--pending';
  }
  
}


  getStepIndex(item: Step, index: number): string | number {
    if (item?.status?.toLowerCase() === 'failed') {
      return 'X';
    }
    if (item?.status?.toLowerCase() === 'done') {
      return '✓';
    }
    return index + 1;
  }
}
