import { AppBar, Avatar, Box, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import { useLocation, useNavigate } from 'react-router-dom';
import solysLogo from 'assets/solys-logo.png';
import { useSession } from 'providers/SessionProvider';

const UserChip = () => {
  const { session, loja, logout } = useSession();
  const navigate = useNavigate();
  const nome = session?.tipo === 'loja'
    ? (loja?.solicitanteNome || loja?.nome || 'Loja')
    : 'Diretoria';
  const sub = session?.tipo === 'loja'
    ? (loja?.nome || '')
    : 'SOLYS · Gestão';
  const initials = (nome || '?').split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
  return (
    <Stack direction="row" alignItems="center" spacing={1.2}>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'primary.darker', lineHeight: 1.1 }}>
          {nome}
        </Typography>
        <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {sub}
        </Typography>
      </Box>
      <Avatar sx={{
        width: 38, height: 38, bgcolor: 'primary.darker', color: 'secondary.main',
        fontWeight: 700, fontSize: 13,
      }}>{initials}</Avatar>
      <IconButton size="small" onClick={() => { logout(); navigate('/authentication/login'); }}
        title="Sair">
        <IconifyIcon icon="solar:logout-3-bold" fontSize={18} sx={{ color: 'text.secondary' }} />
      </IconButton>
    </Stack>
  );
};
interface NavbarProps {
  onDrawerToggle: () => void;
}
const MainNavbar = ({ onDrawerToggle }: NavbarProps) => {
  const location = useLocation();

  // Mapa de rota → título amigável
  const routeTitles: Record<string, string> = {
    '': 'Pedidos das Lojas',
    'lojas': 'Lojas',
    'acessos': 'Acessos',
    'minha-lista': 'Minha Lista',
    'novo-pedido': 'Novo Pedido',
  };
  const pathSegments = location.pathname.split('/').filter((s) => s.trim() !== '');
  const last = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
  const routeName = routeTitles[last] ?? last.replace(/-/g, ' ');

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'common.white' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: { xs: 0, lg: 2 },
          }}
        >
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: { sm: 'h2.fontSize', xl: 'h1.fontSize' },
              fontWeight: 600,
              color: 'primary.darker',
              flex: 1,
              textAlign: { xs: 'center', md: 'left' },
              textTransform: 'capitalize',
            }}
          >
            {routeName}
          </Typography>
          <Stack direction="row" gap={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Link href="/" sx={{ display: 'flex', p: 0.5 }}>
              <Image src={solysLogo} alt="Logo" sx={{ width: 28 }} />
            </Link>
            <IconButton onClick={onDrawerToggle} sx={{ display: { md: 'none' } }}>
              <IconifyIcon icon="mingcute:menu-line" color="primary.darker" width={25} />
            </IconButton>
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 2, xl: 2.5 } }}>
            <UserChip />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MainNavbar;
