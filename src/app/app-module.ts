import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing-module';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

import { App } from './app';
import { AdminComponent } from './admin.component';
import { VitrineComponent } from './vitrine.component';
import { AnalyticsComponent } from './analytics.component';
import { LojaComponent } from './loja.component';

@NgModule({
  declarations: [
    App,
    AdminComponent,
    VitrineComponent,
    AnalyticsComponent,
    LojaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    // Inicialização do Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
