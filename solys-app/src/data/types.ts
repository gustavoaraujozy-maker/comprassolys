// Tipos do domínio SOLYS

export type StatusPedido =
  | 'Pendente'
  | 'Aprovado'
  | 'Em compra'
  | 'Entregue'
  | 'Rejeitado'
  | 'Arquivado';

export interface LojaItem {
  id: string;
  descricao: string;
  jan: number;
  fev: number;
  mar: number;
  abr: number;
  mai: number;
  jun: number;
  jul: number;
  ago: number;
  set: number;
  out: number;
  nov: number;
  dez: number;
  obs: string;
}

export interface Loja {
  id: string;
  codigo: string;
  nome: string;
  localidade: string;
  endereco: string;
  acessoId: string;
  senha: string;
  solicitanteNome: string;
  cadastrado: boolean;
  criadoEm: string;
  itens: LojaItem[];
}

export interface ItemPedido {
  descricao: string;
  quantidade: number;
  unidade: string;
}

export interface HistoricoEntry {
  at: string;
  by: string;
  action: string;
}

export interface AnexoMeta {
  nome: string;
  tamanho?: number;
  tipo?: string;
}

export interface Pedido {
  id: string;
  lojaId: string;
  lojaNome: string;
  lojaLocal: string;
  data: string; // YYYY-MM-DD (sempre 1º do mês escolhido)
  solicitante: string;
  observacao: string;
  anexos: AnexoMeta[];
  itens: ItemPedido[];
  historico: HistoricoEntry[];
  status: StatusPedido;
  respondidoPor: string;
  respostaAdmin: string;
  criadoEm: string;
}

export interface Session {
  tipo: 'loja' | 'gestao';
  lojaId?: string;
  solicitante?: string;
  role?: 'Diretoria' | 'Administrador';
}

export const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'] as const;
export const MESES_LABEL = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
export const MES_NOME = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
