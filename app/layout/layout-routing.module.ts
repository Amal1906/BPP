import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { EventDetailsComponent } from '../modules/event-details/event-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'details',
        loadChildren: () =>
          import('../../app/modules/event-details/event-details.module').then(
            (m) => m.EventDetailsModule
          ),
      },
      {
        path: 'trigger',
        loadChildren: () =>
          import('../modules/trigger/trigger.module').then(
            (m) => m.TriggerModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'catalyst-library',
        loadChildren: () =>
          import('../modules/catalyst-library/catalyst-library.module').then(
            (m) => m.CatalystLibraryModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
