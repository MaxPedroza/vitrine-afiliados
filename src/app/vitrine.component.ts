import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Produto } from './models/produto.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.scss'],
  standalone: false
})
export class VitrineComponent implements OnInit {
  produtos$: Observable<Produto[]>;

  constructor(private productService: ProductService) {
    // Busca os produtos e filtra os não expirados
    this.produtos$ = this.productService.getProdutos().pipe(
      map(produtos => this.filtrarProdutosValidos(produtos))
    );
  }

  ngOnInit(): void {}

  // Filtra apenas produtos que ainda não expiraram
  private filtrarProdutosValidos(produtos: Produto[]): Produto[] {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return produtos.filter(produto => {
      // Se não tem data de expiração, mostra
      if (!produto.data_expiracao) {
        return true;
      }

      // Se tem data de expiração, verifica se ainda é válida
      const dataExp = new Date(produto.data_expiracao + 'T00:00:00');
      return dataExp >= hoje;
    });
  }

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