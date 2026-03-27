import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { Produto } from './models/produto.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.scss'],
  standalone: false
})
export class VitrineComponent {
  produtos$: Observable<Produto[]>;

  constructor(private productService: ProductService) {
    const hoje = new Date().toISOString().split('T')[0];
    
    this.produtos$ = this.productService.getProdutos().pipe(
      map(produtos => produtos.filter(p => {
        // Se não houver data, mostra. Se houver, limpa espaços e compara.
        return !p.data_expiracao || p.data_expiracao.trim() === '' || p.data_expiracao >= hoje;
      }))
    );
  }

  irParaOferta(produto: Produto) {
    this.productService.registrarClique(produto).then(() => {
      window.open(produto.link_compra, '_blank');
    }).catch(() => window.open(produto.link_compra, '_blank'));
    // O catch acima garante que o usuário vá para a loja mesmo se o contador falhar
  }
}