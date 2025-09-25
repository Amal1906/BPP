import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TriggerRoutingModule } from './trigger-routing.module';
import { TriggerComponent } from './trigger.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,       
    TriggerRoutingModule,
    TriggerComponent
  ]
})
export class TriggerModule {}
