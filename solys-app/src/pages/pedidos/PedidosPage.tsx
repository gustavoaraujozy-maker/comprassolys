import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud, isoToAno, isoToMesIdx, somar } from 'data/cloudApi';
import { MES_NOME, Pedido, StatusPedido } from 'data/types';

const STATUS_THEME: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Pendente: {
    label: 'Aguardando aprovação',
    color: '#B91C1C', bg: '#FEE2E2', border: '#FCA5A5',
  },
  Aprovado: {
    label: 'Aprovado',
    color: '#15803D', bg: '#DCFCE7', border: '#86EFAC',
  },
  'Em compra': {
    label: 'Em compra',
    color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD',
  },
  Entregue: {
    label: 'Entregue',
    color: '#065F46', bg: '#BBF7D0', border: '#34D399',
  },
  Rejeitado: {
    label: 'Rejeitado',
    color: '#475569', bg: '#F1F5F9', border: '#CBD5E1',
  },
};

const PedidoCard = ({ p, onAprovar, onEntregar, onReverter }: {
  p: Pedido;
  onAprovar: (id: string) => void;
  onEntregar: (id: string) => void;
  onReverter: (id: string) => void;
}) => {
  const theme = STATUS_THEME[p.status] || STATUS_THEME.Pendente;
  const total = somar(p.itens);
  const mes = MES_NOME[isoToMesIdx(p.data)];
  const ano = isoToAno(p.data);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2.5,
        background: `linear-gradient(180deg, ${theme.bg} 0%, #fff 60%)`,
        border: `1px solid ${theme.border}`,
        p: 2,
        mb: 1.5,
        boxShadow: `0 8px 24px -10px ${theme.color}20`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 38, height: 38,
            borderRadius: 1.5,
            display: 'grid', placeItems: 'center',
            bgcolor: 'primary.darker', color: 'secondary.main',
          }}
        >
          <IconifyIcon icon="solar:shop-2-bold" fontSize={18} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: 'primary.darker', lineHeight: 1.1 }}>
            {p.lojaNome}
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
            {p.lojaLocal}
          </Typography>
        </Box>
      </Stack>

      <Chip
        label={theme.label}
        size="small"
        sx={{
          height: 22,
          bgcolor: theme.color + '22',
          color: theme.color,
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          mb: 1,
        }}
      />

      <Stack direction="row" spacing={1.5} sx={{ fontSize: 11, color: 'text.secondary', mb: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 11 }}><b>{mes} / {ano}</b></Typography>
        <Typography sx={{ fontSize: 11 }}>· {p.solicitante}</Typography>
        <Typography sx={{ fontSize: 11 }}>· {p.itens.length} itens · {total} un.</Typography>
      </Stack>

      <Box sx={{
        bgcolor: 'rgba(10,61,124,.04)',
        borderRadius: 1.5,
        p: 1.2,
        maxHeight: 160,
        overflow: 'auto',
        mb: 1.5,
      }}>
        {p.itens.map((it, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1} sx={{ py: 0.3 }}>
            <Box sx={{
              minWidth: 36, textAlign: 'center',
              bgcolor: 'primary.darker', color: '#fff',
              fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
              borderRadius: 0.8, py: 0.2,
            }}>{it.quantidade}</Box>
            <Typography sx={{ fontSize: 12.5, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {it.descricao}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Stack direction="row" spacing={1}>
        {p.status === 'Pendente' && (
          <Button size="small" variant="contained" color="success" onClick={() => onAprovar(p.id)}
            startIcon={<IconifyIcon icon="eva:checkmark-fill" fontSize={14} />}>
            Aprovar
          </Button>
        )}
        {(p.status === 'Aprovado' || p.status === 'Em compra') && (
          <Button size="small" variant="contained" color="success" onClick={() => onEntregar(p.id)}
            startIcon={<IconifyIcon icon="solar:box-bold" fontSize={14} />}>
            Marcar entregue
          </Button>
        )}
        {p.status === 'Entregue' && (
          <Button size="small" variant="outlined" color="neutral" onClick={() => onReverter(p.id)}
            startIcon={<IconifyIcon icon="solar:undo-left-round-bold" fontSize={14} />}>
            Reverter
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

const Col = ({ titulo, sub, color, icon, list, ...handlers }: {
  titulo: string; sub: string; color: string; icon: string; list: Pedido[];
  onAprovar: (id: string) => void;
  onEntregar: (id: string) => void;
  onReverter: (id: string) => void;
}) => (
  <Paper elevation={0} sx={{
    bgcolor: 'rgba(10,61,124,.02)',
    border: '1px solid rgba(10,61,124,.08)',
    borderRadius: 3,
    p: 2,
    minHeight: 400,
    position: 'relative',
  }}>
    <Box sx={{
      position: 'absolute', top: 0, left: 18, right: 18, height: 3,
      bgcolor: color, borderRadius: '0 0 3px 3px',
    }} />
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconifyIcon icon={icon} sx={{ color }} fontSize={18} />
        <Typography sx={{ fontWeight: 700, color: 'primary.darker', fontSize: 14 }}>{titulo}</Typography>
      </Stack>
      <Chip label={list.length} size="small"
        sx={{ height: 22, fontWeight: 700, bgcolor: color + '22', color }} />
    </Stack>
    <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5 }}>{sub}</Typography>
    {list.length ? list.map((p) => (
      <PedidoCard key={p.id} p={p} {...handlers} />
    )) : (
      <Box sx={{
        p: 4, textAlign: 'center', color: 'text.disabled',
        border: '1px dashed rgba(0,0,0,.08)', borderRadius: 1.5, mt: 2,
      }}>
        <Typography sx={{ fontSize: 12, fontStyle: 'italic' }}>Sem pedidos aqui</Typography>
      </Box>
    )}
  </Paper>
);

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const load = async () => {
    const ps = await Cloud.loadPedidos();
    setPedidos(ps);
  };

  useEffect(() => {
    load();
    // Realtime
    const ch = Cloud.subscribePedidos(() => load());
    return () => { (ch as any)?.unsubscribe?.(); };
  }, []);

  const mudarStatus = async (id: string, novo: StatusPedido) => {
    const p = pedidos.find((x) => x.id === id);
    if (!p) return;
    const historico = [...(p.historico || []), {
      at: new Date().toISOString(),
      by: 'Diretoria',
      action: `status: ${p.status} → ${novo}`,
    }];
    await Cloud.updatePedido(id, { status: novo, respondidoPor: 'Diretoria', historico });
    await load();
  };

  const aprovar = (id: string) => mudarStatus(id, 'Aprovado');
  const entregar = (id: string) => mudarStatus(id, 'Entregue');
  const reverter = (id: string) => mudarStatus(id, 'Aprovado');

  const aprovar_list = pedidos.filter((p) => p.status === 'Pendente');
  const aprovados = pedidos.filter((p) => p.status === 'Aprovado' || p.status === 'Em compra');
  const entregues = pedidos.filter((p) => p.status === 'Entregue');

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
            Pedidos das Lojas
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            {aprovar_list.length} aguardando · {aprovados.length} em andamento · {entregues.length} entregue(s)
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Col titulo="Aprovar" sub="Aguardando sua aprovação" color="#EF4444" icon="solar:clock-circle-bold"
            list={aprovar_list} onAprovar={aprovar} onEntregar={entregar} onReverter={reverter} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Col titulo="Aprovados" sub="Aprovados / em compra" color="#1456A6" icon="solar:check-circle-bold"
            list={aprovados} onAprovar={aprovar} onEntregar={entregar} onReverter={reverter} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Col titulo="Entregues" sub="Concluídos (somem em 20 dias)" color="#10B981" icon="solar:box-bold"
            list={entregues} onAprovar={aprovar} onEntregar={entregar} onReverter={reverter} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PedidosPage;
