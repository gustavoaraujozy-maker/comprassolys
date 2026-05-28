import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="section" textAlign="center">
      <Container maxWidth="xl" disableGutters>
        <Box pb={2.5}>
          <Typography
            sx={{
              fontSize: 12,
              color: 'text.secondary',
              letterSpacing: 0.5,
            }}
          >
            <Box component="b" sx={{ color: 'primary.darker', fontWeight: 700 }}>SOLYS</Box>
            {' · Logística de Compras · '}
            &copy; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
