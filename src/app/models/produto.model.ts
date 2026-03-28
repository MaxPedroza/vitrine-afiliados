export interface Loja {
  id: string;
  nome: string;
}

export interface Produto {
  id?: string;
  nome: string;
  link_compra: string;
  link_imagem: string;
  loja: string;
  cliques: number;
  posicao: number;
  data_expiracao: string;
  ativo?: boolean;
}
