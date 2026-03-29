import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing-module';

// Firebase imports (compat + new SDK)
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { App } from './app';
import { AdminComponent } from './admin.component';
import { VitrineComponent } from './vitrine.component';
import { AnalyticsComponent } from './analytics.component';
import { LojaComponent } from './loja.component';
import { LoginComponent } from './login.component';
import { SettingsComponent } from './settings.component';

// Novo componente de Popups
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [
    App,
    AdminComponent,
    VitrineComponent,
    AnalyticsComponent,
    LojaComponent,
    LoginComponent,
    SettingsComponent,
    NotificationComponent // <--- Adicionado aqui
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [App]
})
export class AppModule { }