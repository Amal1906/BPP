import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Step {
  name: string;
  status: 'pending' | 'inprogress' | 'done' | 'failed';
  hoverMessage?: string;
}

export interface StepConfig {
  name: string;
  hoverMessage: string;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class StepperComponent implements OnInit {
  @Input() workType: string = '';
  @Input() currentSteps: Step[] = [];
  @Input() loading = false;
  
  stepperConfig: { [key: string]: { steps: StepConfig[] } } = {};
  displaySteps: Step[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStepperConfig();
  }

  ngOnChanges() {
    this.updateDisplaySteps();
  }

  private loadStepperConfig() {
    this.http.get<any>('/assets/mock-data/stepper-config.json').subscribe({
      next: (config) => {
        this.stepperConfig = config;
        this.updateDisplaySteps();
      },
      error: (error) => {
        console.error('Error loading stepper config:', error);
      }
    });
  }

  private updateDisplaySteps() {
    if (!this.workType || !this.stepperConfig[this.workType]) {
      this.displaySteps = [];
      return;
    }

    const configSteps = this.stepperConfig[this.workType].steps;
    this.displaySteps = configSteps.map((configStep, index) => {
      // Find matching step from current steps or create default
      const currentStep = this.currentSteps.find(step => 
        step.name.toLowerCase().includes(configStep.name.toLowerCase()) ||
        configStep.name.toLowerCase().includes(step.name.toLowerCase())
      );

      return {
        name: configStep.name,
        status: currentStep?.status || 'pending',
        hoverMessage: configStep.hoverMessage
      } as Step;
    });
  }

  getStepClass(step: Step, index: number): string {
    const status = step.status.toLowerCase();
    switch (status) {
      case 'done': return 'stepper__step--done';
      case 'inprogress': return 'stepper__step--inprogress';
      case 'failed': return 'stepper__step--failed';
      default: return 'stepper__step--pending';
    }
  }

  getStepIcon(step: Step, index: number): string {
    const status = step.status.toLowerCase();
    if (status === 'failed') return '✗';
    if (status === 'done') return '✓';
    return (index + 1).toString();
  }
}