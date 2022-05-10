import { pageRoutes } from "@/src/routes";
import { Avatar, Box, Button, Divider, Drawer, IconButton, Menu, SwipeableDrawer, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { appwrite } from "store/global";
import { MenuOption } from "./MenuOption";
import MenuIcon from '@mui/icons-material/Menu'
import Link from "next/link";

interface UserMenuProps {
  user: any;
  setUser: any;
}

export const UserMenu = ({ user, setUser }: UserMenuProps) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const handleLogOut = () => {
    appwrite.account.deleteSession('current').then(() => {
      setUser(null)
      setTimeout(() => {
        router.push(pageRoutes.home);
      }, 100)
    })
  }
  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor={'left'}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <Box p={2}>
          <Typography variant='h5' p={2}>Badge.Ar</Typography>
          <Divider />
          <Box my={2}>
            <Link href={pageRoutes.achievementsAddSelect}>
              <Button onClick={handleClose} fullWidth variant='contained'>Mint achievements</Button>
            </Link>
          </Box>
          <Divider />
          <MenuOption py={4} onClick={handleClose} href={pageRoutes.profile}>
            Profile
          </MenuOption>
          <MenuOption py={4} onClick={handleClose} href={pageRoutes.myAchievements}>
            My NFTs
          </MenuOption>
          <MenuOption py={4} onClick={handleClose} href={pageRoutes.wallet}>
            My wallet
          </MenuOption>
          <MenuOption py={4} onClick={handleClose} href={pageRoutes.orders}>
            Order history
          </MenuOption>
          <Divider />
          <MenuOption py={4} onClick={handleClose} href={pageRoutes.about}>
            About
          </MenuOption>
          <Divider />
          <MenuOption py={4} onClick={() => {handleLogOut(); handleClose()}}>
            Log out
          </MenuOption>
        </Box>
      </SwipeableDrawer>
    </>
  )
}