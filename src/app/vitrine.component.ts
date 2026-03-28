import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Produto } from './models/produto.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.scss'],
  standalone: false
})
export class VitrineComponent implements OnInit {
  produtos$: Observable<Produto[]>;

  constructor(private productService: ProductService) {
    // Busca os produtos já ordenados pela 'posicao' que você definiu no Admin
    this.produtos$ = this.productService.getProdutos();
  }

  ngOnInit(): void {}

  // Função que abre o link e conta o clique no Firebase
  irParaOferta(p: Produto): void {
    if (p.id) {
      // Registra o clique no banco
      this.productService.registrarClique(p.id)
        .then(() => {
          // Abre o link do afiliado em uma nova aba
          window.open(p.link_compra, '_blank');
        })
        .catch((err: any) => {
          console.error("Erro ao registrar clique:", err);
          // Abre o link mesmo se o contador falhar
          window.open(p.link_compra, '_blank');
        });
    }
  }
}