import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalystLibraryComponent } from './catalyst-library.component';

const routes: Routes = [
  {
    path: '',
    component: CatalystLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalystLibraryRoutingModule { }