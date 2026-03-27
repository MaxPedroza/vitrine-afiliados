import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Produto, Loja } from './models/produto.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: false
})
export class AdminComponent implements OnInit {
  produtos: Produto[] = [];
  lojas$: Observable<Loja[]>;
  private produtos$: Observable<Produto[]>;
  novoProduto: Partial<Produto> = this.getEmptyProduct();

  constructor(private productService: ProductService) {
    this.lojas$ = this.productService.getLojas();
    this.produtos$ = this.productService.getProdutos();
  }

  ngOnInit(): void {
    this.produtos$.subscribe(data => {
      // Criamos uma nova referência do array para forçar o Angular a atualizar a tela
      this.produtos = [...data];
    });
  }

  private getEmptyProduct() {
    return {
      nome: '', link_compra: '', link_imagem: '',
      loja: '', cliques: 0, posicao: 0, data_expiracao: ''
    };
  }

  adicionar() {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!this.novoProduto.nome || this.novoProduto.nome.trim() === '') {
      alert('O nome do produto é obrigatório.');
    } else if (!this.novoProduto.link_compra || this.novoProduto.link_compra.trim() === '') {
      alert('O link de afiliado é obrigatório.');
    } else {
      this.novoProduto.posicao = this.produtos.length;
      this.productService.adicionarProduto(this.novoProduto as Omit<Produto, 'id'>)
        .then(() => this.novoProduto = this.getEmptyProduct())
        .catch(err => alert('Erro ao salvar produto: ' + err.message));
    }
  }

  limparTudo() {
    if (confirm('ATENÇÃO: Isso apagará TODOS os produtos permanentemente. Confirmar?')) {
      this.productService.limparTodosProdutos().catch(err => alert('Erro ao limpar: ' + err.message));
    }
  }

  remover(id: string) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.removerProduto(id).catch(err => alert('Erro ao excluir: ' + err.message));
    }
  }

  drop(event: CdkDragDrop<Produto[]>) {
    moveItemInArray(this.produtos, event.previousIndex, event.currentIndex);
    this.productService.atualizarOrdenacao(this.produtos);
  }
}