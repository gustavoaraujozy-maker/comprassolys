import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud, isoToAno, isoToMesIdx } from 'data/cloudApi';
import { MES_NOME, MESES, MESES_LABEL, Pedido } from 'data/types';
import { useSession } from 'providers/SessionProvider';
import paths from 'routes/path';

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  Pendente:    { color: '#B91C1C', bg: '#FEE2E2' },
  Aprovado:    { color: '#15803D', bg: '#DCFCE7' },
  'Em compra': { color: '#1D4ED8', bg: '#DBEAFE' },
  Entregue:    { color: '#065F46', bg: '#BBF7D0' },
  Rejeitado:   { color: '#475569', bg: '#F1F5F9' },
};

const MinhaListaPage = () => {
  const navigate = useNavigate();
  const { loja } = useSession();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mesSel, setMesSel] = useState<number | null>(null);

  useEffect(() => {
    if (!loja) return;
    Cloud.loadPedidos().then((all) => setPedidos(all.filter((p) => p.lojaId === loja.id)));
  }, [loja]);

  if (!loja) return null;

  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth();
  // contagem por mês (do ano atual)
  const totaisPorMes = MESES.map((_, i) => pedidos
    .filter((p) => isoToAno(p.data) === anoAtual && isoToMesIdx(p.data) === i)
    .reduce((s, p) => s + p.itens.reduce((a, x) => a + (x.quantidade || 0), 0), 0));

  const pedidosMesSel = mesSel != null
    ? pedidos.filter((p) => isoToAno(p.data) === anoAtual && isoToMesIdx(p.data) === mesSel)
    : [];

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
            {loja.nome}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconifyIcon icon="solar:map-point-bold" fontSize={13} />
            {loja.localidade}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconifyIcon icon="eva:plus-fill" fontSize={16} />}
          onClick={() => navigate(paths.novoPedido)}
          sx={{ bgcolor: 'primary.darker', '&:hover': { bgcolor: 'primary.main' } }}
        >
          Fazer novo pedido
        </Button>
      </Stack>

      <Card sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <IconifyIcon icon="solar:history-bold" fontSize={18} sx={{ color: 'secondary.main' }} />
          <Typography sx={{ fontWeight: 700, color: 'primary.darker', fontSize: 15 }}>
            Histórico {anoAtual}
          </Typography>
          <Box sx={{
            px: 1, py: 0.25, fontSize: 9, fontWeight: 700, letterSpacing: 1,
            bgcolor: 'secondary.main', color: '#1a1208', borderRadius: 99,
          }}>ATUAL</Box>
        </Stack>
        <Grid container spacing={1}>
          {MESES.map((_, i) => {
            const ativo = mesSel === i;
            const isAtual = i === mesAtual;
            const total = totaisPorMes[i];
            return (
              <Grid key={i} item xs={3} sm={2} md={1}>
                <Box
                  onClick={() => setMesSel(ativo ? null : i)}
                  sx={{
                    p: 1.5, textAlign: 'center', borderRadius: 1.5, cursor: 'pointer',
                    border: '1px solid',
                    borderColor: ativo ? 'secondary.main' : 'rgba(0,0,0,.06)',
                    bgcolor: ativo ? 'rgba(200,155,60,.12)' : isAtual ? 'rgba(200,155,60,.05)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(200,155,60,.08)' },
                    transition: 'all .12s',
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {MESES_LABEL[i]}
                  </Typography>
                  {total > 0 && (
                    <Typography sx={{ fontSize: 10, color: 'secondary.main', mt: 0.3, fontWeight: 600 }}>
                      {total} un.
                    </Typography>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {mesSel != null && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(10,61,124,.04)', borderRadius: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: 'primary.darker', fontSize: 14, mb: 1 }}>
              {MES_NOME[mesSel]} / {anoAtual} — {pedidosMesSel.length} pedido(s)
            </Typography>
            {pedidosMesSel.length === 0 ? (
              <Typography sx={{ fontSize: 12.5, color: 'text.disabled', fontStyle: 'italic' }}>
                Nenhum pedido registrado neste mês.
              </Typography>
            ) : pedidosMesSel.map((p) => {
              const c = STATUS_COLOR[p.status] || STATUS_COLOR.Pendente;
              return (
                <Box key={p.id} sx={{
                  mt: 1, p: 1.5, bgcolor: '#fff',
                  borderRadius: 1, borderLeft: `3px solid ${c.color}`,
                }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'primary.darker' }}>
                      {p.solicitante} · {p.itens.length} itens
                    </Typography>
                    <Box sx={{
                      px: 1, py: 0.25, borderRadius: 0.5,
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                      bgcolor: c.bg, color: c.color,
                    }}>{p.status}</Box>
                  </Stack>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {p.itens.slice(0, 5).map((i) => `${i.quantidade} ${i.descricao}`).join(' · ')}
                    {p.itens.length > 5 ? ` · +${p.itens.length - 5}` : ''}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MinhaListaPage;
