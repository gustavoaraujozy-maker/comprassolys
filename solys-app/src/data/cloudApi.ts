import { supabase } from './supabase';
import { Loja, Pedido, MESES } from './types';

// utilitários de data (evita bug de timezone do JS)
export function isoToMesIdx(iso?: string | null): number {
  if (!iso) return new Date().getMonth();
  const m = /^(\d{4})-(\d{2})/.exec(String(iso));
  return m ? parseInt(m[2]) - 1 : new Date(iso).getMonth();
}
export function isoToAno(iso?: string | null): number {
  if (!iso) return new Date().getFullYear();
  const m = /^(\d{4})/.exec(String(iso));
  return m ? parseInt(m[1]) : new Date(iso).getFullYear();
}

function mapLoja(l: any): Loja {
  return {
    id: l.id,
    codigo: l.codigo,
    nome: l.nome,
    localidade: l.localidade,
    endereco: l.endereco || '',
    acessoId: l.acesso_id || '',
    senha: l.senha || '',
    solicitanteNome: l.solicitante_nome || '',
    cadastrado: !!l.cadastrado,
    criadoEm: l.criado_em,
    itens: (l.loja_itens || []).map((it: any) => ({
      id: it.id,
      descricao: it.descricao,
      jan: it.jan | 0, fev: it.fev | 0, mar: it.mar | 0, abr: it.abr | 0,
      mai: it.mai | 0, jun: it.jun | 0, jul: it.jul | 0, ago: it.ago | 0,
      set: it.set | 0, out: it.out | 0, nov: it.nov | 0, dez: it.dez | 0,
      obs: it.obs || '',
    })),
  };
}

function mapPedido(p: any): Pedido {
  return {
    id: p.id,
    lojaId: p.loja_id,
    lojaNome: p.loja_nome,
    lojaLocal: p.loja_local,
    data: p.data,
    solicitante: p.solicitante,
    observacao: p.observacao || '',
    anexos: p.anexos || [],
    itens: p.itens || [],
    historico: p.historico || [],
    status: p.status,
    respondidoPor: p.respondido_por || '',
    respostaAdmin: p.resposta_admin || '',
    criadoEm: p.criado_em,
  };
}

export const Cloud = {
  mapLoja,
  mapPedido,

  async loadLojas(): Promise<Loja[]> {
    const { data, error } = await supabase
      .from('lojas')
      .select('*, loja_itens(*)')
      .order('nome');
    if (error) throw error;
    return (data || []).map(mapLoja);
  },

  async loadPedidos(): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .neq('status', 'Arquivado')
      .order('criado_em', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPedido);
  },

  async insertPedido(p: Partial<Pedido>): Promise<Pedido | null> {
    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        loja_id: p.lojaId,
        loja_nome: p.lojaNome,
        loja_local: p.lojaLocal,
        data: p.data,
        solicitante: p.solicitante,
        observacao: p.observacao || '',
        anexos: p.anexos || [],
        itens: p.itens || [],
        historico: p.historico || [],
        status: p.status || 'Pendente',
      })
      .select()
      .single();
    if (error || !data) return null;
    return mapPedido(data);
  },

  async updatePedido(id: string, patch: Partial<Pedido>): Promise<boolean> {
    const row: any = {};
    const map: Record<string, string> = {
      status: 'status',
      respondidoPor: 'respondido_por',
      respostaAdmin: 'resposta_admin',
      historico: 'historico',
      itens: 'itens',
      observacao: 'observacao',
      solicitante: 'solicitante',
      data: 'data',
      anexos: 'anexos',
    };
    for (const k of Object.keys(patch) as (keyof Pedido)[]) {
      const dbField = map[k as string];
      if (dbField) row[dbField] = (patch as any)[k];
    }
    const { error } = await supabase.from('pedidos').update(row).eq('id', id);
    return !error;
  },

  async deletePedido(id: string): Promise<boolean> {
    const { error } = await supabase.from('pedidos').delete().eq('id', id);
    return !error;
  },

  async incLojaItemMes(lojaId: string, descricao: string, mesKey: string, delta: number): Promise<void> {
    const desc = (descricao || '').toUpperCase().trim();
    const { data: existing } = await supabase
      .from('loja_itens')
      .select('*')
      .eq('loja_id', lojaId)
      .eq('descricao', desc)
      .maybeSingle();
    if (existing) {
      const novo = (existing[mesKey] | 0) + (delta | 0);
      await supabase.from('loja_itens').update({ [mesKey]: novo }).eq('id', existing.id);
    } else {
      await supabase.from('loja_itens').insert({ loja_id: lojaId, descricao: desc, [mesKey]: delta | 0 });
    }
  },

  async cadastrarLoja(lojaId: string, solicitante: string, senha: string, endereco: string): Promise<boolean> {
    const { error } = await supabase
      .from('lojas')
      .update({ solicitante_nome: solicitante, senha, cadastrado: true, endereco })
      .eq('id', lojaId);
    return !error;
  },

  async resetarCadastroLoja(lojaId: string): Promise<boolean> {
    const { error } = await supabase
      .from('lojas')
      .update({ solicitante_nome: '', senha: 'Sgroup@2026#', cadastrado: false, endereco: '' })
      .eq('id', lojaId);
    return !error;
  },

  async atualizarEndereco(lojaId: string, endereco: string): Promise<boolean> {
    const { error } = await supabase.from('lojas').update({ endereco }).eq('id', lojaId);
    return !error;
  },

  subscribePedidos(onChange: (payload: any) => void) {
    return supabase
      .channel('rt-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, onChange)
      .subscribe();
  },
};

export function somar(itens: { quantidade: number }[]): number {
  return itens.reduce((s, i) => s + (i.quantidade || 0), 0);
}

export { MESES };
