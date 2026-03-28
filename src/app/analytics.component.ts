import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service'; // Ajustado para o caminho correto
import { Produto } from './models/produto.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: false
})
export class AnalyticsComponent implements OnInit {
  produtosRanking$: Observable<Produto[]>;

  constructor(private productService: ProductService) {
    // Buscamos os produtos e ordenamos por cliques (do maior para o menor)
    this.produtosRanking$ = this.productService.getProdutos().pipe(
      map((produtos: Produto[]) => 
        [...produtos].sort((a, b) => (b.cliques || 0) - (a.cliques || 0))
      )
    );
  }

  ngOnInit(): void {}

  getPercentual(cliques: number, total: number): number {
    return total > 0 ? (cliques / total) * 100 : 0;
  }
}