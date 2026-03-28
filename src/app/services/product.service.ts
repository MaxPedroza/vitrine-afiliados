import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto, Loja } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private basePath = 'produtos';
  private baseLojas = 'lojas';

  private produtosList: AngularFireList<Produto>;
  private lojasList: AngularFireList<Loja>;

  constructor(private db: AngularFireDatabase) {
    // Inicializa as referências. Note o orderByChild para o Firebase já trazer ordenado por 'posicao'
    this.produtosList = this.db.list<Produto>(this.basePath, ref => ref.orderByChild('posicao'));
    this.lojasList = this.db.list<Loja>(this.baseLojas);
  }

  // Busca produtos. Usamos snapshotChanges para pegar o ID gerado pelo Firebase junto com os dados
  getProdutos(): Observable<Produto[]> {
    return this.produtosList.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const data = c.payload.val() as Produto;
          return { ...data, id: c.payload.key || undefined };
        })
      )
    );
  }

  // Adiciona novo produto com ID manual baseado em Timestamp para facilitar a gestão
  adicionarProduto(produto: Omit<Produto, 'id'>) {
    const id = Date.now().toString();
    // Salva no nó específico com o ID gerado
    return this.db.object(`${this.basePath}/${id}`).set({ ...produto, id });
  }

  // Atualiza um produto existente
  atualizarProduto(id: string, produto: Partial<Produto>) {
    return this.db.object(`${this.basePath}/${id}`).update(produto);
  }

  // Remove um produto pelo ID
  removerProduto(id: string) {
    return this.db.object(`${this.basePath}/${id}`).remove();
  }

  // Apaga todos os produtos do banco (Botão "Limpar Tudo")
  limparTodosProdutos() {
    return this.db.object(this.basePath).remove();
  }

  // Incrementa o contador de cliques para o "Foguinho" 🔥
  // Usando transação para garantir que o incremento seja atômico e preciso no servidor
  registrarClique(id: string) {
    return this.db.object(`${this.basePath}/${id}/cliques`).query.ref.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });
  }

  // GESTÃO DE LOJAS
  getLojas(): Observable<Loja[]> {
    return this.lojasList.valueChanges();
  }

  adicionarLoja(nome: string) {
    const id = Date.now().toString();
    return this.db.object(`${this.baseLojas}/${id}`).set({ id, nome });
  }

  // Remove uma loja pelo ID
  removerLoja(id: string) {
    return this.db.object(`${this.baseLojas}/${id}`).remove();
  }

  // ATUALIZAÇÃO EM MASSA (O motor do Drag and Drop)
  // Recebe o array reordenado do Admin e envia apenas as novas posições
  atualizarOrdenacao(produtos: Produto[]) {
    const updates: any = {};
    produtos.forEach((p, index) => {
      if (p.id) {
        updates[`${this.basePath}/${p.id}/posicao`] = index;
      }
    });
    // O update na raiz do banco é o jeito mais rápido e evita múltiplos requests
    return this.db.database.ref().update(updates);
  }
}