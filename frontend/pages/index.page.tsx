import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Divider, Stack, useTheme } from '@mui/material';
import Link from 'next/link';
import { pageRoutes } from '@/src/routes';


const Home: NextPage = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '90vh',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom display='flex' flexDirection='column' alignItems='flex-start'>
          Mint your{' '}
          <Box bgcolor={theme.palette.primary.main} height='1em' mt={1} pb={7} boxSizing='border-box'>awards</Box>
        </Typography>
        <Divider sx={{marginTop: '2rem'}} />
        <Stack spacing={4} mt={10}>
          <Link href={pageRoutes.createAnAccount}>
            <Button variant='outlined' fullWidth>Get started</Button>
          </Link>
          <Link href={pageRoutes.login}>
            <Button variant='text' fullWidth>Log in</Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
