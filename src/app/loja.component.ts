import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { NotificationService } from './services/notification.service';
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

  constructor(
    private productService: ProductService,
    private notify: NotificationService
  ) {
    this.lojas$ = this.productService.getLojas();
  }

  adicionarLoja() {
    if (this.novaLojaNome.trim()) {
      // Se o nome da loja não estiver vazio, procede com a adição
      this.productService.adicionarLoja(this.novaLojaNome.trim())
        .then(() => this.novaLojaNome = '')
        .catch((err: any) => this.notify.show('Erro ao adicionar loja: ' + err.message, 'error'));
    } else {
      this.notify.show('O nome da loja não pode ser vazio.', 'error');
    }
  }

  async removerLoja(id: string) {
    if (await this.notify.confirm('Deseja remover esta loja?')) {
      this.productService.removerLoja(id)
        .catch((err: any) => this.notify.show('Erro ao remover loja: ' + err.message, 'error'));
    }
  }
}