import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <h1 class="title-purple">Painel de Controle</h1>
      <div class="dashboard-grid">
        <a routerLink="/vitrine" class="card-dashboard">
          <span class="material-icons">shopping_bag</span>
          <h3>Minha Vitrine</h3>
        </a>
        <a routerLink="/admin" class="card-dashboard">
          <span class="material-icons">inventory_2</span>
          <h3>Produtos</h3>
        </a>
        <a routerLink="/lojas" class="card-dashboard">
          <span class="material-icons">storefront</span>
          <h3>Lojas</h3>
        </a>
        <a routerLink="/analytics" class="card-dashboard">
          <span class="material-icons">bar_chart</span>
          <h3>Relatórios</h3>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 16px; max-width: 1000px; margin: 0 auto; box-sizing: border-box; }
    .title-purple { 
      text-align: center; 
      font-size: 1.5rem; 
      color: #967BB6; 
      margin: 10px 0 24px 0;
      font-weight: 700;
    }
    .dashboard-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 12px;
    }
    .card-dashboard {
      background: white;
      border-radius: 16px;
      padding: 24px 12px;
      text-align: center;
      text-decoration: none;
      color: #4a4a4a;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: transform 0.2s;
      min-height: 120px;
      border: 1px solid rgba(150, 123, 182, 0.1);
    }
    .card-dashboard:active { transform: scale(0.95); }
    .card-dashboard .material-icons { font-size: 28px; color: #967BB6; }
    .card-dashboard h3 { margin: 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    @media (min-width: 768px) { 
      .dashboard-container { padding: 40px 20px; }
      .title-purple { font-size: 2rem; margin-bottom: 40px; }
      .dashboard-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
      .card-dashboard { padding: 32px 16px; min-height: 160px; }
      .card-dashboard:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      .card-dashboard .material-icons { font-size: 40px; }
      .card-dashboard h3 { font-size: 16px; }
    }
  `]
})
export class HomeComponent {}