// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';

// export interface Step {
//   step: string;
//   status: 'pending' | 'inprogress' | 'done' | 'failed';
//   status_message?: string;
// }

// @Component({
//   selector: 'app-stepper',
//   templateUrl: './stepper.component.html',
//   styleUrls: ['./stepper.component.scss'],
//   imports: [CommonModule],
//   standalone: true
// })
// export class StepperComponent {
//   @Input() workFlow: Step[] = [];
//   @Input() loading = false;

//   getStepClass(item: Step, index: number): string {
//   const s = (item?.status || '').toLowerCase();
//   switch (s) {
//     case 'done': return 'stepper__step--done';
//     case 'inprogress': return 'stepper__step--inprogress';
//     case 'failed': return 'stepper__step--failed';
//     default: return 'stepper__step--pending';
//   }
// }

//   getStatusClass(item: Step, index: number): boolean {
//     if (item?.status?.toLowerCase() === 'done') return true;
//     const hasFutureDone = this.workFlow?.slice(index + 1)?.some(s => s.status?.toLowerCase() === 'done');
//     return !!hasFutureDone;
//   }
// }

