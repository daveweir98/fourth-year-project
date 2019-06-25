import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {SearchComponent} from './search/search.component';
import {HistoryComponent} from './history/history.component';
import {ReportComponent} from './report/report.component';
import {NewCarComponent} from './new-car/new-car.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'search', component: SearchComponent},
  {path: 'report/:appraisalId', component: ReportComponent},
  {path: 'history/:carRegistration', component: HistoryComponent},
  {path: 'new-car', component: NewCarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
