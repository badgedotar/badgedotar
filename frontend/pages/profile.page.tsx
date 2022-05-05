import Box from '@mui/material/Box';
import { pageRoutes } from '@/src/routes';
import useSteam from '@/src/hooks/useSteam';
import { Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { syncGames } from '@/src/utils/syncGames';
import { getBadges } from '@/src/utils/getBadges';
import { withUser } from '@/src/utils/withUser';
import { UserLogged } from 'store/types';

const Page = ({ user }: {user: UserLogged}) => {
  const { steamAccounts } = useSteam(user)

  const handleLogBadges = () => {
    getBadges(user.$id).then(badges => {
      console.log({badges});
    })
  }

  const handleSync = () => {
    if(steamAccounts.length) {
      syncGames(steamAccounts[0].$id)
    }
  }

  return (
    <Container maxWidth='md'>
      <Stack spacing={2} py={4}>
        <Typography variant='h3'>
          {user.name}
        </Typography>
        <Typography variant='h5'>
          Steam accounts:
        </Typography>
        <Box>
          {steamAccounts.length ?
            steamAccounts.map(account => (
              <div key={account.$id}>
                Steam ID: <Link href={`https://steamcommunity.com/profiles/${account.providerId}`}>{account.providerId}</Link>
              </div>
            ))
            :
              <Link href={`https://www.badge.ar/api/steam/connect?id=${user.$id}`}>
                <Button>Sync your steam account</Button>
              </Link>
          }
        </Box>

        <Button onClick={handleSync}>Sync your games</Button>
        <Button onClick={handleLogBadges}>Log badges</Button>
      </Stack>
    </Container>
  )
}

export default withUser(Page, {
  params: {'redirectTo': pageRoutes.login}
})