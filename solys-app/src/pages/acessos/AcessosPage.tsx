import { Box, Button, Card, Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud } from 'data/cloudApi';
import { Loja } from 'data/types';

const AcessosPage = () => {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});

  const load = () => { Cloud.loadLojas().then(setLojas); };
  useEffect(() => { load(); }, []);

  const reset = async (id: string) => {
    const l = lojas.find((x) => x.id === id);
    if (!l) return;
    if (!confirm(`Resetar cadastro de ${l.nome}? A senha volta ao padrão "Sgroup@2026#" e o solicitante será apagado.`)) return;
    await Cloud.resetarCadastroLoja(id);
    load();
  };

  const cadastradas = lojas.filter((l) => l.cadastrado).length;
  const pendentes = lojas.length - cadastradas;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
        Acessos das Lojas
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 3 }}>
        {cadastradas} cadastrada(s) · {pendentes} aguardando 1º acesso · senha padrão{' '}
        <Box component="code" sx={{
          bgcolor: 'rgba(200,155,60,.12)', color: 'secondary.dark',
          px: 0.75, py: 0.25, borderRadius: 0.5, fontFamily: 'monospace', fontWeight: 600,
        }}>Sgroup@2026#</Box>
      </Typography>

      <Grid container spacing={2}>
        {lojas.map((l) => (
          <Grid key={l.id} item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2.2, border: '1px solid rgba(10,61,124,.08)' }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.5 }}>
                <Box sx={{
                  width: 38, height: 38, borderRadius: 1.5,
                  background: 'linear-gradient(135deg, rgba(200,155,60,.18) 0%, rgba(200,155,60,.05) 100%)',
                  border: '1px solid rgba(200,155,60,.3)',
                  color: 'secondary.main', display: 'grid', placeItems: 'center',
                }}>
                  <IconifyIcon icon="solar:shop-2-bold" fontSize={18} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: 'primary.darker', fontSize: 14 }}>{l.nome}</Typography>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
                    {l.localidade}
                  </Typography>
                </Box>
                <Chip
                  label={l.cadastrado ? 'Cadastrada' : '1º acesso'}
                  size="small"
                  sx={{
                    height: 22, fontSize: 9, fontWeight: 700, letterSpacing: 0.6,
                    textTransform: 'uppercase',
                    bgcolor: l.cadastrado ? '#DCFCE7' : '#FEF3C7',
                    color: l.cadastrado ? '#15803D' : '#92400E',
                  }}
                />
              </Stack>

              <Box sx={{ bgcolor: 'rgba(10,61,124,.04)', borderRadius: 1.2, p: 1.5 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary', letterSpacing: 1.4, textTransform: 'uppercase', mb: 0.3 }}>
                  Solicitante
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.primary', mb: 1.5 }}>
                  {l.solicitanteNome || '— ainda não cadastrado —'}
                </Typography>

                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary', letterSpacing: 1.4, textTransform: 'uppercase', mb: 0.3 }}>
                  Endereço
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.primary', mb: 1.5 }}>
                  {l.endereco || '— não cadastrado —'}
                </Typography>

                <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary', letterSpacing: 1.4, textTransform: 'uppercase', mb: 0.3 }}>
                  Senha atual
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box component="code" sx={{
                    flex: 1, bgcolor: '#fff', border: '1px solid rgba(0,0,0,.08)',
                    borderRadius: 0.8, px: 1, py: 0.5,
                    fontFamily: 'monospace', fontSize: 12, color: 'primary.darker',
                  }}>
                    {showPwd[l.id] ? l.senha : '•'.repeat(Math.max(8, (l.senha || '').length))}
                  </Box>
                  <IconButton size="small" onClick={() => setShowPwd((s) => ({ ...s, [l.id]: !s[l.id] }))}>
                    <IconifyIcon icon={showPwd[l.id] ? 'eva:eye-off-fill' : 'eva:eye-fill'} fontSize={16} />
                  </IconButton>
                  <IconButton size="small"
                    onClick={() => navigator.clipboard.writeText(l.senha || '')}>
                    <IconifyIcon icon="solar:copy-bold" fontSize={16} />
                  </IconButton>
                </Stack>
              </Box>

              <Button
                fullWidth size="small" variant="outlined" color="neutral" sx={{ mt: 1.5 }}
                startIcon={<IconifyIcon icon="solar:refresh-bold" fontSize={14} />}
                onClick={() => reset(l.id)}
              >
                Resetar cadastro
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AcessosPage;
