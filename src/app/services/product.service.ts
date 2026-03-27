import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Produto, Loja } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private basePath = 'produtos';
  private baseLojas = 'lojas';

  // Referências pré-inicializadas para evitar erros de context injection em chamadas assíncronas
  private produtosList: AngularFireList<Produto>;
  private lojasList: AngularFireList<Loja>;

  constructor(private db: AngularFireDatabase) {
    this.produtosList = this.db.list<Produto>(this.basePath, ref => ref.orderByChild('posicao'));
    this.lojasList = this.db.list<Loja>(this.baseLojas);
  }

  // Busca produtos ordenados pela posição
  getProdutos(): Observable<Produto[]> {
    return this.produtosList.valueChanges();
  }

  // Adiciona novo produto com ID baseado em Timestamp (conforme doc)
  adicionarProduto(produto: Omit<Produto, 'id'>) {
    const id = Date.now().toString();
    return this.produtosList.query.ref.child(id).set({ ...produto, id });
  }

  // Remove um produto pelo ID
  removerProduto(id: string) {
    return this.produtosList.query.ref.child(id).remove();
  }

  // Apaga todos os produtos do banco
  limparTodosProdutos() {
    return this.produtosList.query.ref.remove();
  }

  // Incrementa o contador de cliques
  registrarClique(produto: Produto) {
    return this.produtosList.query.ref.child(`${produto.id}/cliques`).transaction(currentValue => {
      return (currentValue || 0) + 1;
    });
  }

  // Gestão de Lojas
  getLojas(): Observable<Loja[]> {
    return this.lojasList.valueChanges();
  }

  adicionarLoja(nome: string) {
    const id = Date.now().toString();
    console.log('Tentando adicionar loja:', { id, nome });
    return this.lojasList.query.ref.child(id).set({ id, nome });
  }

  removerLoja(id: string) {
    return this.lojasList.query.ref.child(id).remove();
  }

  // Atualização em massa para o Drag and Drop
  atualizarOrdenacao(produtos: Produto[]) {
    const updates: any = {};
    produtos.forEach((p, index) => {
      updates[`${this.basePath}/${p.id}/posicao`] = index;
    });
    return this.db.database.ref().update(updates);
  }
}
