import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VitrineComponent } from './vitrine.component';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './analytics.component';
import { LojaComponent } from './loja.component';

const routes: Routes = [
  { path: '', component: VitrineComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'lojas', component: LojaComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
