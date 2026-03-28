import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    .material-icons {
      font-family: 'Material Icons';
      font-display: block;
    }

    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f3f0ff; /* Lilás Suave de fundo */
    }

    .main-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 2px solid #967BB6;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom); /* Suporte para iPhone moderno */
    }

    .tabs-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 65px;
      gap: 10px;
    }

    .tabs-wrapper a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #8e8e8e;
      padding: 5px 10px;
      gap: 4px;
      transition: all 0.2s ease;
    }

    .tabs-wrapper a .material-icons {
      font-size: 22px;
    }

    .tabs-wrapper a span:not(.material-icons) {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .tabs-wrapper a.active {
      color: #967BB6; /* Lilás destaque */
      font-weight: 700;
    }
    
    .tabs-wrapper a.active .material-icons {
      transform: scale(1.1);
    }

    .page-content {
      flex: 1;
      padding-bottom: 80px; /* Espaço para não cobrir o conteúdo pela nav mobile */
    }

    /* Ajustes para Desktop */
    @media (min-width: 768px) {
      .main-nav {
        position: sticky;
        top: 0;
        bottom: auto;
        background-color: #dcd6f7;
        border-top: none;
        border-bottom: 2px solid #967BB6;
        padding: 0 20px;
        box-shadow: none;
      }
      .tabs-wrapper {
        height: 70px;
        max-width: 1000px;
        margin: 0 auto;
        justify-content: center;
        gap: 40px;
      }
      .tabs-wrapper a { 
        flex: none; 
        flex-direction: row; 
        gap: 8px; 
        padding: 12px 24px;
        border-radius: 12px 12px 0 0;
        transition: all 0.3s ease;
      }
      .tabs-wrapper a.active {
        background-color: #967BB6;
        color: #ffffff !important;
        margin-bottom: -2px;
        box-shadow: 0 -4px 12px rgba(150, 123, 182, 0.2);
      }
      .tabs-wrapper a.active .material-icons { color: #ffffff; }
      .tabs-wrapper a span:not(.material-icons) { font-size: 14px; text-transform: none; }
      .page-content { padding-bottom: 20px; }
    }
  `]
})
export class App {
  protected readonly title = signal('vitrine-afiliados');
}
