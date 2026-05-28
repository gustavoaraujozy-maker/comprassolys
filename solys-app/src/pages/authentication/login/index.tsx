import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from 'components/base/IconifyIcon';
import { Cloud } from 'data/cloudApi';
import { Loja } from 'data/types';
import { useSession } from 'providers/SessionProvider';
import { supabase } from 'data/supabase';
import paths from 'routes/path';
import solysLogo from 'assets/solys-logo.png';

const SENHA_DIRETORIA = 'Solys@2027#k';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaSel, setLojaSel] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');

  // cadastro 1º acesso
  const [needRegister, setNeedRegister] = useState(false);
  const [regNome, setRegNome] = useState('');
  const [regEndereco, setRegEndereco] = useState('');
  const [regSenha1, setRegSenha1] = useState('');
  const [regSenha2, setRegSenha2] = useState('');

  useEffect(() => {
    Cloud.loadLojas().then((ls) => setLojas(ls)).catch(() => setErr('Falha ao carregar lojas'));
  }, []);

  const onLogin = async () => {
    setErr('');
    if (!lojaSel) return setErr('Selecione sua loja');
    if (!senha) return setErr('Informe a senha');
    setLoading(true);
    try {
      // re-busca para evitar stale
      const { data, error } = await supabase.from('lojas').select('*').eq('id', lojaSel).maybeSingle();
      if (error || !data) {
        setErr('Loja não encontrada');
        return;
      }
      if (senha !== data.senha) {
        setErr('Senha incorreta');
        return;
      }
      if (!data.cadastrado) {
        setNeedRegister(true);
        return;
      }
      const loja = Cloud.mapLoja(data);
      setSession({ tipo: 'loja', lojaId: loja.id, solicitante: loja.solicitanteNome }, loja);
      navigate(paths.minhaLista);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async () => {
    setErr('');
    if (regNome.trim().length < 2) return setErr('Informe seu nome completo');
    if (regEndereco.trim().length < 5) return setErr('Informe o endereço completo da loja');
    if (regSenha1.length < 6) return setErr('A nova senha precisa ter no mínimo 6 caracteres');
    if (regSenha1 !== regSenha2) return setErr('As senhas não conferem');
    setLoading(true);
    try {
      // re-checa pra evitar corrida
      const { data: fresh } = await supabase
        .from('lojas')
        .select('cadastrado,solicitante_nome')
        .eq('id', lojaSel)
        .maybeSingle();
      if (fresh && fresh.cadastrado) {
        setErr(`Loja já cadastrada por ${fresh.solicitante_nome || 'outro usuário'}.`);
        setNeedRegister(false);
        return;
      }
      const ok = await Cloud.cadastrarLoja(lojaSel, regNome.trim(), regSenha1, regEndereco.trim());
      if (!ok) {
        setErr('Falha ao salvar cadastro. Tente novamente.');
        return;
      }
      const { data } = await supabase.from('lojas').select('*, loja_itens(*)').eq('id', lojaSel).single();
      const loja = Cloud.mapLoja(data);
      setSession({ tipo: 'loja', lojaId: loja.id, solicitante: loja.solicitanteNome }, loja);
      navigate(paths.minhaLista);
    } finally {
      setLoading(false);
    }
  };

  const onAdminLogin = () => {
    setErr('');
    if (adminPwd !== SENHA_DIRETORIA) return setErr('Senha incorreta');
    setSession({ tipo: 'gestao', role: 'Diretoria' });
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: 1,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #062347 0%, #082E5C 50%, #041A33 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            boxShadow: '0 24px 60px -12px rgba(0,0,0,.5)',
          }}
        >
          {/* LOGO */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box
              component="img"
              src={solysLogo}
              alt="SOLYS"
              sx={{ width: 180, height: 'auto', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.18))' }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                letterSpacing: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: 10,
              }}
            >
              Logística de Compras
            </Typography>
          </Stack>

          {!needRegister && !showAdmin && (
            <>
              <Typography variant="h4" sx={{ mb: 0.5, color: 'primary.darker', fontWeight: 700 }}>
                Acesso à plataforma
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Selecione sua loja e informe a senha
              </Typography>

              {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

              <TextField
                select
                fullWidth
                label="Loja"
                value={lojaSel}
                onChange={(e) => setLojaSel(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
              >
                <MenuItem value="">— Selecione sua loja —</MenuItem>
                {lojas.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.nome} — {l.localidade}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Senha"
                type={showPwd ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onLogin()}
                size="small"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPwd((v) => !v)}>
                        <IconifyIcon icon={showPwd ? 'eva:eye-off-fill' : 'eva:eye-fill'} fontSize={18} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={onLogin}
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  bgcolor: 'primary.darker',
                  '&:hover': { bgcolor: 'primary.main' },
                }}
              >
                Entrar
              </Button>

              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Button
                  size="small"
                  startIcon={<IconifyIcon icon="solar:shield-bold" fontSize={14} />}
                  onClick={() => { setShowAdmin(true); setErr(''); }}
                  sx={{ color: 'secondary.main', fontSize: 11.5, fontWeight: 600 }}
                >
                  Acesso da gestão
                </Button>
              </Stack>
            </>
          )}

          {needRegister && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <b>Cadastro único.</b> Esse cadastro só pode ser feito uma vez. Depois de salvar,
                somente você (com sua senha pessoal) e a Diretoria terão acesso a esta loja.
              </Alert>
              {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.darker' }}>
                Primeiro acesso — {lojas.find((l) => l.id === lojaSel)?.nome}
              </Typography>
              <Stack spacing={2}>
                <TextField label="Seu nome completo" size="small" fullWidth
                  value={regNome} onChange={(e) => setRegNome(e.target.value)} />
                <TextField label="Endereço completo da loja" size="small" fullWidth
                  placeholder="Av. Bezerra de Menezes, 1234 — Bairro, Fortaleza/CE"
                  value={regEndereco} onChange={(e) => setRegEndereco(e.target.value)} />
                <TextField label="Nova senha" type="password" size="small" fullWidth
                  value={regSenha1} onChange={(e) => setRegSenha1(e.target.value)} />
                <TextField label="Confirme a senha" type="password" size="small" fullWidth
                  value={regSenha2} onChange={(e) => setRegSenha2(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onRegister()} />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <Button variant="outlined" color="neutral" fullWidth
                  onClick={() => { setNeedRegister(false); setErr(''); }}>Cancelar</Button>
                <Button variant="contained" color="primary" fullWidth disabled={loading}
                  onClick={onRegister}
                  sx={{ bgcolor: 'primary.darker', '&:hover': { bgcolor: 'primary.main' } }}>
                  Cadastrar e entrar
                </Button>
              </Stack>
            </>
          )}

          {showAdmin && (
            <>
              {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.darker' }}>Acesso da Diretoria</Typography>
              <TextField
                fullWidth label="Senha" type="password" size="small"
                value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAdminLogin()}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="neutral" fullWidth
                  onClick={() => { setShowAdmin(false); setErr(''); }}>Voltar</Button>
                <Button variant="contained" color="primary" fullWidth
                  onClick={onAdminLogin}
                  sx={{ bgcolor: 'primary.darker', '&:hover': { bgcolor: 'primary.main' } }}>
                  Entrar como Diretoria
                </Button>
              </Stack>
            </>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
