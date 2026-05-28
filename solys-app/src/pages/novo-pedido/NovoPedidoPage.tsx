import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud, MESES } from 'data/cloudApi';
import { ItemPedido, Loja, MES_NOME } from 'data/types';
import { useSession } from 'providers/SessionProvider';
import paths from 'routes/path';

const NovoPedidoPage = () => {
  const navigate = useNavigate();
  const { loja, session } = useSession();
  const [lojaFresh, setLojaFresh] = useState<Loja | null>(loja);
  const [solicitante, setSolicitante] = useState(session?.solicitante || '');
  const [mesIdx, setMesIdx] = useState<number>(new Date().getMonth());
  const [itens, setItens] = useState<ItemPedido[]>([{ descricao: '', quantidade: 0, unidade: 'un' }]);
  const [observacao, setObservacao] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega referência do mês anterior pra pré-preencher descrições
  useEffect(() => {
    if (!loja) return;
    Cloud.loadLojas().then((ls) => {
      const f = ls.find((x) => x.id === loja.id);
      if (f) {
        setLojaFresh(f);
        // pré-popula com itens do mês anterior se houver
        const prev = (new Date().getMonth() + 11) % 12;
        const mesKey = MESES[prev] as keyof typeof MESES;
        const base = f.itens.filter((it) => (it as any)[mesKey] > 0)
          .map((it) => ({ descricao: it.descricao, quantidade: 0, unidade: 'un' as const }));
        if (base.length) setItens(base);
      }
    });
  }, [loja]);

  const setLinha = (i: number, campo: keyof ItemPedido, valor: any) => {
    setItens((prev) => {
      const next = [...prev];
      (next[i] as any)[campo] = campo === 'quantidade' ? (parseInt(valor) || 0) : valor;
      return next;
    });
  };

  const addLinha = () => setItens((p) => [...p, { descricao: '', quantidade: 0, unidade: 'un' }]);
  const removerLinha = (i: number) => setItens((p) => p.filter((_, idx) => idx !== i));

  const salvar = async () => {
    setErr('');
    if (!loja) return;
    const validos = itens.filter((it) => it.descricao.trim() && it.quantidade > 0)
      .map((it) => ({ descricao: it.descricao.trim().toUpperCase(), quantidade: it.quantidade, unidade: (it.unidade || 'un').trim() }));
    if (!solicitante.trim()) return setErr('Informe quem está solicitando');
    if (!validos.length) return setErr('Preencha a quantidade de pelo menos um produto');

    setLoading(true);
    try {
      const ano = new Date().getFullYear();
      const data = `${ano}-${String(mesIdx + 1).padStart(2, '0')}-01`;
      const novo = await Cloud.insertPedido({
        lojaId: loja.id, lojaNome: loja.nome, lojaLocal: loja.localidade,
        data, solicitante: solicitante.trim(), observacao: observacao.trim(),
        anexos: [], itens: validos, historico: [{
          at: new Date().toISOString(), by: solicitante.trim(), action: 'criado',
        }], status: 'Pendente',
      });
      if (!novo) { setErr('Falha ao enviar pedido'); return; }
      // Soma na grade mensal (histórico) — async fire-and-forget
      const mesKey = MESES[mesIdx];
      validos.forEach((it) => Cloud.incLojaItemMes(loja.id, it.descricao, mesKey, it.quantidade));
      navigate(paths.minhaLista);
    } finally {
      setLoading(false);
    }
  };

  if (!loja) return null;

  return (
    <Box sx={{ maxWidth: 920 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(paths.minhaLista)}>
          <IconifyIcon icon="eva:arrow-back-fill" fontSize={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
            Novo pedido
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{loja.nome}</Typography>
        </Box>
      </Stack>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <Card sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth size="small" label="Para o mês de" value={mesIdx}
              onChange={(e) => setMesIdx(parseInt(String(e.target.value)))}>
              {MES_NOME.map((m, i) => (
                <MenuItem key={i} value={i}>{m} / {new Date().getFullYear()}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Quem está solicitando"
              value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.darker' }}>
            Produtos do pedido
          </Typography>
          <Button size="small" startIcon={<IconifyIcon icon="eva:plus-fill" fontSize={14} />}
            onClick={addLinha}>Adicionar</Button>
        </Stack>

        <Stack spacing={1} sx={{ mb: 3 }}>
          {itens.map((it, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <TextField size="small" type="number" sx={{ width: 90 }}
                value={it.quantidade} onChange={(e) => setLinha(i, 'quantidade', e.target.value)}
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                onFocus={(e) => e.target.select()} />
              <TextField size="small" sx={{ width: 80 }}
                value={it.unidade} onChange={(e) => setLinha(i, 'unidade', e.target.value)}
                inputProps={{ style: { textAlign: 'center' } }} />
              <TextField size="small" fullWidth placeholder="Nome do produto"
                value={it.descricao} onChange={(e) => setLinha(i, 'descricao', e.target.value)} />
              {itens.length > 1 && (
                <IconButton size="small" onClick={() => removerLinha(i)}>
                  <IconifyIcon icon="eva:close-fill" fontSize={16} />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>

        <TextField fullWidth size="small" label="Observação (opcional)" multiline rows={2}
          value={observacao} onChange={(e) => setObservacao(e.target.value)} sx={{ mb: 3 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="outlined" color="neutral" onClick={() => navigate(paths.minhaLista)}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" disabled={loading}
            sx={{ bgcolor: 'primary.darker', '&:hover': { bgcolor: 'primary.main' } }}
            onClick={salvar} startIcon={<IconifyIcon icon="eva:checkmark-fill" fontSize={16} />}>
            Enviar pedido
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default NovoPedidoPage;
