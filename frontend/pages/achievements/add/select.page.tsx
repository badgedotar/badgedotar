import { Box, Button, ButtonBase, Card, Checkbox, CircularProgress, Container, Dialog, IconButton, Modal, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { AchievementResume, IAchievementResume } from "../components/AchievementResume";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ArrowBack, RadioButtonUnchecked } from "@mui/icons-material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from "react";
import { UserLogged } from "store/types";
import { withUser } from "@/src/utils/withUser";
import { pageRoutes } from "@/src/routes";
import useSteam from "@/src/hooks/useSteam";
import Link from "@/src/Link";
import { getSteamBadges, UserSteamBadges } from "@/src/utils/getSteamBadges";
import { HandlePayment } from "./components/HandlePayment";
import background from '../../accounts/assets/dice.jpg';
import { calculatePrice } from "@/src/utils/paymentCalculation";
import CloseIcon from '@mui/icons-material/Close';
import { syncGames } from "@/src/utils/syncGames";


interface ICheckedState {
  [key: string]: boolean;
}

interface PageProps {
  user: UserLogged
}

const IsLoading = () => {
  return (
      <Box display='flex' justifyContent='center' alignItems='center' height='10rem'>
        <CircularProgress />
      </Box>
  )
}

const Page: NextPage<PageProps> = ({ user }) => {
  const maxToMint = 5;
  const [isReloading, setIsReloading] = useState(false);
  const [ checked, setChecked ] = useState<ICheckedState>({});
  const totalChecked = Object.keys(checked).filter(key => checked[key]).length;
  
  // max badges
  const [openMaxAlert, setOpenMaxAlert] = useState(false);
  const handleCloseMaxAlert = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') { return; }
    setOpenMaxAlert(false);
  };
  const maxAlertSnack = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseMaxAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  const handleSetChecked = (id: string) => {
    const newValue = !checked[id];
    if((totalChecked >= maxToMint) && newValue) {
      setOpenMaxAlert(true);
      return;
    } else {
      setChecked({
        ...checked,
        [id]: !checked[id]
      });
    }
  }
  const {steamAccounts, isLoading} = useSteam(user)
  const [userBadges, setUserBadges] = useState<UserSteamBadges['userBadges']>({})
  const [categories, setCategories] = useState<UserSteamBadges['categories']>({})
  const [loadingBadges, setLoadingBadges] = useState(true)
  const [isPaying , setIsPaying] = useState(false)
  const togglePayment = () => {
    setIsPaying(!isPaying)
  }
  const handleSyncGames = () => {
    setIsReloading(true);
    if(steamAccounts.length) {
      syncGames(steamAccounts[0].$id).then((response: any) => {
        location.reload();
      }).catch((err) => {
        location.reload();
      })
    } else {
      setIsReloading(false);
    }
  }
  useEffect(() => {
    setLoadingBadges(true)
    if(steamAccounts.length === 0) {
      setLoadingBadges(false)
      return;
    }
    getSteamBadges({
      userId: steamAccounts[0].$id,
      minted: false
    }).then( (badgesResponse) => {
      setUserBadges( (curr) => ({...curr, ...(badgesResponse.userBadges)}) )
      setCategories( (curr) => ({...curr, ...(badgesResponse.categories)}) )
      setLoadingBadges(false)
    }).catch((err: any) => {
      console.error(err)
      setLoadingBadges(false)
    })
  }, [steamAccounts.length])

  if(isLoading) return <IsLoading />
  if(loadingBadges) return <IsLoading />
  if(steamAccounts.length === 0) return (
    <Box display='flex' justifyContent='center' alignItems='center' height='10rem'>
      <Typography variant='h5'>No steam accounts found</Typography>
      <Link href={`https://www.badge.ar/api/steam/connect?id=${user.$id}`}>
        <Button>Sync your steam account</Button>
      </Link>
    </Box>
  )

  return (
    <Container maxWidth='md'>
      <Stack position='relative' spacing={4} py={4}>
        <Box display='flex' justifyContent='center' flexDirection='column'>
          <Typography variant='h5' textAlign='center'>Select achievements to mint</Typography>
        </Box>
        <Button onClick={handleSyncGames}>Reload achievements</Button>
        <Snackbar
          open={openMaxAlert}
          autoHideDuration={6000}
          onClose={handleCloseMaxAlert}
          message="You cant mint more than 5 badges at a time."
          action={maxAlertSnack}
        />
        <Dialog open={isReloading}>
          <Container>
            <Box p={4}>
              <IsLoading />
              <Typography variant='h5'>Reloading your achievements</Typography>
              <Typography>This could take a few minutes.</Typography>
            </Box>
          </Container>
        </Dialog>
        {isPaying && (
          <Dialog
            open={isPaying}
            onClose={togglePayment}
            style={{background: `url("${background.src}")`}}
          >
                <Box p={{xs: 2, sm: 4}}>
                  <Stack direction='row' mb={4} justifyContent='flex-start' alignItems={'center'} spacing={2}>
                    <IconButton onClick={togglePayment}><ArrowBack/> </IconButton>
                    <Typography variant='h4' mb={0}>Handle payment</Typography>
                  </Stack>
                  <HandlePayment
                    user={user}
                    userBadges={Object.values(userBadges).filter( badge => checked[badge.$id] )}
                  />
                </Box>
          </Dialog>
        )}

        <Box pb={10}>
          <Stack spacing={0}>
            {Object.values(userBadges).map((userBadge) => (
              <ButtonBase sx={{display:'block'}} onClick={()=>{handleSetChecked(userBadge.$id)}} key={userBadge.$id}>
                <Box py={2}>
                  <AchievementResume badge={userBadge} category={categories[userBadge.badgeData.category]}>
                    <Checkbox checked={checked[`${userBadge.$id}`] === true} icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleIcon />}/>
                  </AchievementResume>
                </Box>
              </ButtonBase>
            ))}
          </Stack>
        </Box>
        <Button
          sx={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30rem',
            opacity: 1,
            '&:disabled': {
              background: '#646464',
            },
          }}
          disabled={totalChecked === 0 || isReloading}
          variant='contained'
          fullWidth
          onClick={togglePayment}
        >
          Mint {totalChecked} <EmojiEventsIcon/>
          {totalChecked > 0 && <Box ml={1}>({calculatePrice(totalChecked)}₳)</Box>}
        </Button>
      </Stack>
    </Container>
  )
}

export default withUser(Page, {
  params: {'redirectTo': pageRoutes.login}
})