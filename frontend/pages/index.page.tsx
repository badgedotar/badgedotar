import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Divider, Stack, useTheme } from '@mui/material';
import Link from 'next/link';
import { pageRoutes } from '@/src/routes';
import useUser from '@/src/hooks/useUser';
import WhatIsBadgeAr from './components/WhatIsBadgeAr.mdx';

const Home: NextPage = () => {
  const { loading } = useUser({'redirectIfFound': pageRoutes.profile});
  const theme = useTheme();

  if(loading) {
    return <div>Loading...</div>
  }
  
  return (
    <Container maxWidth="sm">
      <Box
        py={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '90vh',
        }}
      >
        <Stack spacing={4}>
          <Typography my={10} variant="h2" component="h1" gutterBottom display='flex' flexDirection='column' alignItems='flex-start'>
            Mint your{' '}
            <Box bgcolor={theme.palette.primary.main} height='1em' mt={1} pb={10} boxSizing='border-box'>awards</Box>
          </Typography>
          <Divider/>
          <WhatIsBadgeAr />
          <Link href={pageRoutes.about}>
            <Button variant='text' fullWidth>Read more</Button>
          </Link>
          <Divider/>
          <Typography variant="h5" component="h4" textAlign="center">Ready to mint?</Typography>
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
