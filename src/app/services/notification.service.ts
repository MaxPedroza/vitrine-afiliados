import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationData {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export interface ConfirmData {
  show: boolean;
  message: string;
  resolve?: (result: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData>({
    message: '',
    type: 'success',
    show: false
  });

  notification$ = this.notificationSubject.asObservable();
  
  private confirmSubject = new BehaviorSubject<ConfirmData>({
    show: false,
    message: ''
  });
  
  confirmState$ = this.confirmSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.notificationSubject.next({ message, type, show: true });
    setTimeout(() => this.hide(), duration);
  }

  hide() {
    this.notificationSubject.next({ ...this.notificationSubject.value, show: false });
  }

  // Substitui o window.confirm()
  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmSubject.next({
        show: true,
        message,
        resolve
      });
    });
  }

  handleConfirm(result: boolean) {
    const state = this.confirmSubject.value;
    if (state.resolve) state.resolve(result);
    this.confirmSubject.next({ show: false, message: '' });
  }
}