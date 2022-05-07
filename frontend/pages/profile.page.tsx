import Box from '@mui/material/Box';
import { pageRoutes } from '@/src/routes';
import useSteam from '@/src/hooks/useSteam';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { syncGames } from '@/src/utils/syncGames';
import { withUser } from '@/src/utils/withUser';
import { UserLogged } from 'store/types';
import { AccountBalanceWallet, Add, Token } from '@mui/icons-material';
import { CardOption } from '@/src/components/CardOption';

const Page = ({ user }: {user: UserLogged}) => {
  const { steamAccounts } = useSteam(user)

  const handleSync = () => {
    if(steamAccounts.length) {
      syncGames(steamAccounts[0].$id)
    }
  }

  return (
    <Container maxWidth='sm'>
      <Box pt={4}>
        <Card>
          <Stack spacing={4} p={4}>
            <Typography variant='h3' textAlign='center'>
              {user.name}
            </Typography>
            <Card variant='outlined'>
              <Box p={2}>
                <Typography variant='h5' mb={2}>
                  Steam account
                </Typography>
                <Stack spacing={4}>
                  {steamAccounts.length ?
                    steamAccounts.map(account => (
                      <div key={account.$id}>
                        Steam ID: <Link href={`https://steamcommunity.com/profiles/${account.providerId}`}>{account.providerId}</Link>
                      </div>
                    ))
                    :
                      (
                        <>
                          <Typography variant='body1'>
                            You must sync your Steam account to mint achievements.
                          </Typography>
                          <Link href={`https://www.badge.ar/api/steam/connect?id=${user.$id}`}>
                            <Button variant='contained'>Sync Steam account</Button>
                          </Link>
                        </>
                      )
                  }
                </Stack>
              </Box>
            </Card>
            <Stack spacing={4} alignItems='center' justifyContent='center' direction={{xs: 'column', md:'row'}}>
              <CardOption disabled={steamAccounts.length === 0} icon={Add} href={pageRoutes.achievementsAddSelect} >Mint new</CardOption>
              <CardOption icon={Token} href={pageRoutes.myAchievements} >Your NFTs</CardOption>
              <CardOption icon={AccountBalanceWallet} href={pageRoutes.wallet} >Your Wallet</CardOption>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Container>
  )
}

export default withUser(Page, {
  params: {'redirectTo': pageRoutes.login}
})

