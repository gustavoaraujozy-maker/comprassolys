import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud } from 'data/cloudApi';
import { Loja } from 'data/types';

const LojasPage = () => {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    Cloud.loadLojas().then(setLojas);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'primary.darker', fontWeight: 700, mb: 0.5 }}>
        Lojas
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 3 }}>
        {lojas.length} unidades cadastradas
      </Typography>
      <Grid container spacing={2}>
        {lojas.map((l) => (
          <Grid key={l.id} item xs={12} sm={6} md={4}>
            <Card
              onClick={() => navigate(`/lojas/${l.id}`)}
              sx={{
                p: 2.5,
                cursor: 'pointer',
                border: '1px solid rgba(10,61,124,.08)',
                transition: 'all .18s',
                '&:hover': {
                  borderColor: 'secondary.main',
                  boxShadow: '0 12px 30px -10px rgba(10,61,124,.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: 1.5,
                  background: 'linear-gradient(135deg, rgba(200,155,60,.18) 0%, rgba(200,155,60,.05) 100%)',
                  border: '1px solid rgba(200,155,60,.3)',
                  color: 'secondary.main',
                  display: 'grid', placeItems: 'center',
                }}>
                  <IconifyIcon icon="solar:shop-2-bold" fontSize={22} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: 'primary.darker', fontSize: 15, letterSpacing: '-0.2px' }}>
                    {l.nome}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconifyIcon icon="solar:map-point-bold" fontSize={11} /> {l.localidade}
                  </Typography>
                </Box>
                <IconifyIcon icon="solar:alt-arrow-right-line-duotone" fontSize={18} sx={{ color: 'text.secondary' }} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LojasPage;
