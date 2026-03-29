import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VitrineComponent } from './vitrine.component';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './analytics.component';
import { LojaComponent } from './loja.component';
import { LoginComponent } from './login.component';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', component: VitrineComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'lojas', component: LojaComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
