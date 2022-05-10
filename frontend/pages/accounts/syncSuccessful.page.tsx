import { CardOption } from "@/src/components/CardOption"
import { IsLoading } from "@/src/components/IsLoading"
import { SteamError } from "@/src/components/SteamError"
import useSteam from "@/src/hooks/useSteam"
import { pageRoutes } from "@/src/routes"
import { syncGames } from "@/src/utils/syncGames"
import { withUser } from "@/src/utils/withUser"
import { AccountBalanceWallet, Add, Person } from "@mui/icons-material"
import { Box, Container, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { UserLogged } from "store/types"

interface PageProps {
  user: UserLogged
}

const Page = ({ user }: PageProps) => {
  const [isLoadingSync, setIsLoadingSync] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {steamAccounts, isLoading: isLoadingSteam} = useSteam(user);

  const syncSteamGames = () => {
    setIsLoadingSync(true);
    if(steamAccounts.length) {
      setIsLoadingSync(true);
      syncGames(steamAccounts[0].$id).then((response: any) => {
        if(response.stdout.includes('Private Profile')) {
          setError("This account is private.");
        }
        setIsLoadingSync(false);
      }).catch((err) => {
        setError("An error occurred while syncing games");
        const stdoutRaw = err.stdout;
        // detect if Private Profile in string
        if(stdoutRaw.includes("Private Profile")) {
          setError("This account is private.");
        }
        setIsLoadingSync(false);
      })
    } else {
      setIsLoadingSync(false);
    }
  }

  useEffect(() => {
    syncSteamGames();
  }, [steamAccounts.length])

  const handleRetry = () => {
    setError(null);
    syncSteamGames();
  }

  if(isLoadingSteam) {
    return (
      <IsLoading />
    )
  }
  if(!(steamAccounts.length)) {
    return (
      <Container maxWidth='sm'>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography>
            You don't have any Steam account linked to your account.
          </Typography>
        </Box>
      </Container>
    )
  }
  
  if(error) {
    return <SteamError error={error} handleRetry={handleRetry} />
  }
  return (
    <Box py={8}>
      <Container maxWidth='sm'>
        <Stack alignItems="center" spacing={4}>
          {isLoadingSync ?
            <>
                <Box>
                  <IsLoading height={'10rem'}/>
                </Box>
                <Typography variant='h4'>We are synchronizing your Steam achievements, this could take a minute...</Typography>
            </>
            :
            <>
              <Typography variant='h4'>Synchronization completed!</Typography>
              <Stepper orientation="vertical">
                <Step completed>
                  <StepLabel>Sync your steam account</StepLabel>
                </Step>
                <Step active>
                  <StepLabel>Select achievements to mint</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Add ADA to your wallet</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Get your NFTs!</StepLabel>
                </Step>
              </Stepper>
              <Stack spacing={4} alignItems='center' justifyContent='center' direction={{xs: 'column', md:'row'}}>
                  <CardOption icon={Add} href={pageRoutes.achievementsAddSelect}>
                    Start minting
                  </CardOption>
                  <CardOption icon={Person} href={pageRoutes.achievementsAddSelect}>
                    Back to profile
                  </CardOption>
                  <CardOption icon={AccountBalanceWallet} href={pageRoutes.wallet} >My wallet</CardOption>
              </Stack>
              <Typography>You will need to transfer ADA into your wallet in order to mint. You can do that before or after selecting the achievements.</Typography>
            </>
          }
        </Stack>
      </Container>
    </Box>
  )
}

export default withUser(Page, {
  params: {'redirectTo': pageRoutes.login}
})

