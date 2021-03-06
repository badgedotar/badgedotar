import { IsLoading } from "@/src/components/IsLoading"
import useSteam from "@/src/hooks/useSteam"
import { NavOption } from "@/src/layouts/main/NavOption"
import { pageRoutes } from "@/src/routes"
import { getSteamBadges, UserSteamBadges } from "@/src/utils/getSteamBadges"
import { withUser } from "@/src/utils/withUser"
import { TokenOutlined } from "@mui/icons-material"
import { Box, ButtonBase, Container, Stack, Typography } from "@mui/material"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { UserLogged } from "store/types"
import { AchievementResume } from "./components/AchievementResume"

interface PageProps {
  user: UserLogged
}

const Page: NextPage<PageProps> = ({ user }) => {
  const {steamAccounts, isLoading} = useSteam(user)
  const [userBadges, setUserBadges] = useState<UserSteamBadges['userBadges']>({})
  const [categories, setCategories] = useState<UserSteamBadges['categories']>({})
  const [loadingBadges, setLoadingBadges] = useState(true)

  useEffect(() => {
    setLoadingBadges(true)
    if(steamAccounts.length === 0) {
      setLoadingBadges(false)
      return;
    }
    getSteamBadges({
      userId: steamAccounts[0].$id,
      // TODO use real minted data
      minted: true
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
  return (
    <Box py={4}>
      <Container>
        <Stack spacing={4}>
          <Box display='flex'>
            <Stack flexGrow={1} direction='row' alignItems={'center'} spacing={2}>
              <TokenOutlined fontSize='large' />
              <Typography variant='h4' pb={0.5}>Minted NFTs </Typography>
            </Stack>
            <Stack direction='row' alignItems={'center'} spacing={2}>
              <NavOption href={pageRoutes.orders}>
                Your orders
              </NavOption>
              <NavOption href={pageRoutes.achievementsAddSelect}>
                Mint new
              </NavOption>
            </Stack>
          </Box>
          <Box pb={10}>
          <Stack spacing={0}>
              {Object.values(userBadges).map((userBadge) => (
                <ButtonBase sx={{display:'block'}} key={userBadge.$id}>
                  <Box py={2}>
                    <AchievementResume badge={userBadge} category={categories[userBadge.badgeData.category]} />
                  </Box>
                </ButtonBase>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default withUser(Page, {
  params: {
    redirectTo: pageRoutes.login,
  }
})