import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TriggerRoutingModule } from './trigger-routing.module';
import { TriggerComponent } from './trigger.component';

@NgModule({
  declarations: [TriggerComponent],
  imports: [
    CommonModule,
    FormsModule,       // Required for ngModel
    TriggerRoutingModule
  ]
})
export class TriggerModule {}
