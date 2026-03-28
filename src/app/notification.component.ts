import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  template: `
    <ng-container *ngIf="notify.notification$ | async as n">
      <div class="notification-container" *ngIf="n.show" [ngClass]="n.type">
        <span class="material-icons">
          {{ n.type === 'success' ? 'check_circle' : 'error' }}
        </span>
        <p>{{ n.message }}</p>
      </div>
    </ng-container>

    <div class="modal-overlay" *ngIf="(notify.confirmState$ | async)?.show">
      <div class="modal-content">
        <span class="material-icons info-icon">help_outline</span>
        <p>{{ (notify.confirmState$ | async)?.message }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="notify.handleConfirm(false)">Cancelar</button>
          <button class="btn-confirm" (click)="notify.handleConfirm(true)">Confirmar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed; 
      top: 16px; left: 16px; right: 16px; 
      z-index: 9999;
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px; border-radius: 12px; color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    }
    .success { background: #967BB6; } 
    .error { background: #FF5252; }   // Vermelho para Erro
    
    p { margin: 0; font-weight: 500; font-size: 14px; }
    .material-icons { font-size: 20px; }

    @media (min-width: 600px) {
      .notification-container { width: max-content; left: auto; right: 20px; top: 20px; }
    }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      z-index: 10000; padding: 20px; backdrop-filter: blur(4px);
    }
    .modal-content {
      background: white; padding: 30px; border-radius: 20px; width: 100%; max-width: 400px;
      text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .info-icon { font-size: 48px; color: #967BB6; margin-bottom: 15px; }
    .modal-actions { display: flex; gap: 12px; margin-top: 25px; }
    .modal-actions button { 
      flex: 1; padding: 12px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer;
    }
    .btn-cancel { background: #f0f0f0; color: #666; }
    .btn-confirm { background: #967BB6; color: white; }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  constructor(public notify: NotificationService) {}
}