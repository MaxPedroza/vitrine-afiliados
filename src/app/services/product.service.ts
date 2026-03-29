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
    const path = `${this.basePath}/${id}`;
    return this.db.database.ref(path).set({ ...produto, id });
  }

  // Atualiza um produto existente
  atualizarProduto(id: string, produto: Partial<Produto>) {
    const dadosParaAtualizar = { ...produto };
    delete dadosParaAtualizar.id;
    const path = `${this.basePath}/${id}`;
    return this.db.database.ref(path).update(dadosParaAtualizar);
  }

  // Remove um produto pelo ID
  removerProduto(id: string) {
    const path = `${this.basePath}/${id}`;
    return this.db.database.ref(path).remove();
  }

  // Apaga todos os produtos do banco (Botão "Limpar Tudo")
  limparTodosProdutos() {
    return this.db.database.ref(this.basePath).remove();
  }

  // Incrementa o contador de cliques para o "Foguinho" 🔥
  // Usando transação para garantir que o incremento seja atômico e preciso no servidor
  registrarClique(id: string) {
    const path = `${this.basePath}/${id}/cliques`;
    return this.db.database.ref(path).transaction(currentValue => {
      return (currentValue || 0) + 1;
    });
  }

  // GESTÃO DE LOJAS
  getLojas(): Observable<Loja[]> {
    return this.lojasList.valueChanges();
  }

  adicionarLoja(nome: string) {
    const id = Date.now().toString();
    const path = `${this.baseLojas}/${id}`;
    return this.db.database.ref(path).set({ id, nome });
  }

  // Remove uma loja pelo ID
  removerLoja(id: string) {
    const path = `${this.baseLojas}/${id}`;
    return this.db.database.ref(path).remove();
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
    
    return this.db.database.ref().update(updates);
  }
}