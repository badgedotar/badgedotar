import Box from '@mui/material/Box';
import { pageRoutes } from '@/src/routes';
import useUser from '@/src/hooks/useUser';
import useSteam from '@/src/hooks/useSteam';
import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { syncGames } from '@/src/utils/syncGames';
import { getBadges } from '@/src/utils/getBadges';

const Page = () => {
  const { user, loading } = useUser({'redirectTo': pageRoutes.login});
  const { steamAccounts } = useSteam(user)
  
  if(loading || !user) {
    return <div>Loading...</div>
  }

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
    <Box>
      <Container maxWidth='md'>
        {user.name}
        <Link href={`https://www.badge.ar/api/steam/connect?id=${user.$id}`}>
          <Button>Add steam account</Button>
        </Link>

        {steamAccounts.map(account => (
          <div key={account.$id}>
            PROFILE: <Link href={`https://steamcommunity.com/profiles/${account.providerId}`}>{account.providerId}</Link>
          </div>
        ))}

        <Button onClick={handleSync}>Sync your games</Button>
        <Button onClick={handleLogBadges}>Log badges</Button>
      </Container>
    </Box>
  )
}

export default Page