import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { Loja } from './models/produto.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loja',
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.scss'],
  standalone: false
})
export class LojaComponent {
  lojas$: Observable<Loja[]>;
  novaLojaNome: string = '';

  constructor(private productService: ProductService) {
    this.lojas$ = this.productService.getLojas();
  }

  adicionarLoja() {
    if (this.novaLojaNome.trim()) {
      // Se o nome da loja não estiver vazio, procede com a adição
      this.productService.adicionarLoja(this.novaLojaNome.trim())
        .then(() => this.novaLojaNome = '')
        .catch(err => alert('Erro ao adicionar loja: ' + err.message));
    } else {
      alert('O nome da loja não pode ser vazio.');
    }
  }

  removerLoja(id: string) {
    if (confirm('Deseja remover esta loja?')) {
      this.productService.removerLoja(id)
        .catch(err => alert('Erro ao remover loja: ' + err.message));
    }
  }
}