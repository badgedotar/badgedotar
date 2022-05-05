import { pageRoutes } from "@/src/routes";
import { Avatar, IconButton, Menu, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { appwrite } from "store/global";
import { NavOption } from "./NavOption";

interface UserMenuProps {
  user: any;
  setUser: any;
}

export const UserMenu = ({ user, setUser }: UserMenuProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        onClick={handleClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{backgroundColor: theme.palette.primary.light, cursor:'pointer'}}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <NavOption href={pageRoutes.profile}>
          Profile
        </NavOption>
        <NavOption href={pageRoutes.achievementsAddSelect}>
          Achievements
        </NavOption>
        <NavOption href={pageRoutes.achievementsAddSelect}>
          Mint
        </NavOption>
        <NavOption href={pageRoutes.achievementsAddSelect}>
          Wallet
        </NavOption>
        <NavOption onClick={handleLogOut}>
          Log out
        </NavOption>
      </Menu>
    </>
  )
}