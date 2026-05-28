import { Box, Stack, Typography } from '@mui/material';
import Image from 'components/base/Image';

const Logo = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
      <Image src="./solys-logo.png" alt="SOLYS" sx={{ width: 44, height: 'auto' }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: 'primary.darker',
            letterSpacing: '0.5px',
            lineHeight: 1,
            fontSize: 22,
          }}
        >
          SOLYS
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'secondary.main',
            letterSpacing: '2.5px',
            fontSize: 8.5,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Logística de Compras
        </Typography>
      </Box>
    </Stack>
  );
};

export default Logo;
