import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { StepDetailsComponent } from './step-details/step-details.component';

const routes: Routes = [
  {
    path: "",
    component : EventDetailsComponent
  },
  {
    path: "step-details",
    component: StepDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes
)],
  exports: [RouterModule]
})

export class EventDetailsRoutingModule { }
