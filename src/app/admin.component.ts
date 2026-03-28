import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './services/product.service';
import { NotificationService } from './services/notification.service';
import { Produto, Loja } from './models/produto.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: false
})
export class AdminComponent implements OnInit, OnDestroy {
  // Lista que será exibida e reordenada na tela
  produtos: Produto[] = [];
  
  // Observables para carregar dados do Service
  lojas$: Observable<Loja[]>;
  private produtosSubscription: Subscription | undefined;

  // Objeto que limpa o formulário após o cadastro
  novoProduto: Partial<Produto> = this.getEmptyProduct();
  editandoId: string | null = null;

  constructor(
    private productService: ProductService,
    private notify: NotificationService
  ) {
    // Inicializa a lista de lojas (Shopee, Amazon, etc)
    this.lojas$ = this.productService.getLojas();
  }

  ngOnInit(): void {
    // Subscreve aos produtos para manter a lista atualizada em tempo real
    this.produtosSubscription = this.productService.getProdutos().subscribe({
      next: (data: Produto[]) => {
        // Criamos uma nova referência para garantir que o Angular detecte a mudança
        this.produtos = [...data];
      },
      error: (err: any) => console.error('Erro ao carregar produtos:', err)
    });
  }

  // Define o estado inicial de um produto vazio
  private getEmptyProduct(): Partial<Produto> {
    return {
      nome: '',
      link_compra: '',
      link_imagem: '',
      loja: '',
      cliques: 0,
      posicao: 0,
      data_expiracao: '',
      ativo: true
    };
  }

  // Função para salvar o produto no Firebase
  adicionar(): void {
    const nomeValido = this.novoProduto.nome && this.novoProduto.nome.trim();
    const linkValido = this.novoProduto.link_compra && this.novoProduto.link_compra.trim();

    if (!nomeValido || !linkValido) {
      this.notify.show('O nome e o link de afiliado são obrigatórios!', 'error');
      return;
    }

    // Prepara os dados de forma explícita para evitar problemas com campos vazios
    const dadosParaSalvar: any = {
      nome: this.novoProduto.nome,
      link_compra: this.novoProduto.link_compra,
      link_imagem: this.novoProduto.link_imagem || '',
      loja: this.novoProduto.loja || '',
      cliques: this.novoProduto.cliques || 0,
      posicao: this.novoProduto.posicao || 0,
      data_expiracao: this.novoProduto.data_expiracao || '',
      ativo: this.novoProduto.ativo !== undefined ? this.novoProduto.ativo : true
    };

    if (this.editandoId) {
      // Lógica de Edição
      this.productService.atualizarProduto(this.editandoId, dadosParaSalvar)
        .then(() => {
          this.notify.show('Produto atualizado! ✨');
          this.cancelarEdicao();
        })
        .catch(err => this.notify.show(err.message, 'error'));
    } else {
      // Lógica de Adição
      this.novoProduto.posicao = this.produtos.length;
      this.productService.adicionarProduto(dadosParaSalvar as Omit<Produto, 'id'>)
        .then(() => {
          this.notify.show('Produto cadastrado! 🚀');
          this.novoProduto = this.getEmptyProduct();
        })
        .catch(err => this.notify.show(err.message, 'error'));
    }
  }

  editar(produto: Produto): void {
    this.editandoId = produto.id || null;
    this.novoProduto = { ...produto };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.novoProduto = this.getEmptyProduct();
  }

  // Lógica de Puxar e Soltar (Drag and Drop)
  drop(event: CdkDragDrop<Produto[]>): void {
    // 1. Move o item no array local (feedback visual imediato)
    moveItemInArray(this.produtos, event.previousIndex, event.currentIndex);
    
    // 2. Envia a nova ordem para o Firebase atualizar as propriedades 'posicao'
    this.productService.atualizarOrdenacao(this.produtos)
      .catch((err: any) => {
        this.notify.show('Erro ao sincronizar nova ordem: ' + err.message, 'error');
        // Opcional: recarregar a lista original em caso de erro grave
      });
  }

  // Remove um produto individualmente
  async remover(id: string | undefined): Promise<void> {
    if (!id) return;
    
    if (await this.notify.confirm('Deseja excluir este produto permanentemente?')) {
      this.productService.removerProduto(id)
        .then(() => this.notify.show('Produto removido'))
        .catch(err => this.notify.show(err.message, 'error'));
    }
  }

  // Limpa toda a lista do banco de dados
  async limparTudo(): Promise<void> {
    if (await this.notify.confirm('⚠️ ATENÇÃO: Isso apagará TODOS os produtos. Confirmar?')) {
      this.productService.limparTodosProdutos()
        .catch(err => this.notify.show(err.message, 'error'));
    }
  }

  // Boa prática: desinscrever ao destruir o componente para evitar vazamento de memória
  ngOnDestroy(): void {
    if (this.produtosSubscription) {
      this.produtosSubscription.unsubscribe();
    }
  }

  // Calcula a classe de validade baseada na data atual
  getValidadeClass(data: string): string {
    if (!data) return '';
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataExp = new Date(data + 'T00:00:00');
    const diffTime = dataExp.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'status-venceu';        // Vermelho
    if (diffDays <= 7) return 'status-perto';       // Amarelo (7 dias ou menos)
    return 'status-longe';                          // Verde
  }
}