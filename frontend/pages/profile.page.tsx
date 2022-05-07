import Box from '@mui/material/Box';
import { pageRoutes } from '@/src/routes';
import useSteam from '@/src/hooks/useSteam';
import { Button, Card, BoxProps, Container, Stack, Typography, SxProps } from '@mui/material';
import Link from 'next/link';
import { syncGames } from '@/src/utils/syncGames';
import { getBadges } from '@/src/utils/getBadges';
import { withUser } from '@/src/utils/withUser';
import { UserLogged } from 'store/types';
import React from 'react';
import { AccountBalanceWallet, Add, Token } from '@mui/icons-material';

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

const buttonOptionsStyles: SxProps = {
  height: '100%',
  width: '100%',
  minHeight: '130px',
  minWidth: '130px',
}

interface CardOptionProps extends BoxProps {
  href: string
  icon?: any
  disabled?: boolean
}

const CardOption = ({ children, icon, href, disabled, ...props }: React.PropsWithChildren<CardOptionProps>) => {
  const IconComponent = icon ? icon : React.Fragment
  return (
    <Box {...props}>
      <Link href={href}>
        <Button disabled={disabled} sx={buttonOptionsStyles} variant='contained' color='secondary'>
          <Stack p={0} alignItems='center' spacing={1}>
            <IconComponent sx={{fontSize: '50px', marginTop: '10px'}} />
            <Typography variant='button'>
              {children}
            </Typography>
          </Stack>
        </Button>
      </Link>
    </Box>
  )
}