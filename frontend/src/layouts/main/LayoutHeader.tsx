import { Avatar, Box, Button, Container, Stack, Typography, useTheme } from "@mui/material"
import useUser from '@/src/hooks/useUser';
import { pageRoutes } from "@/src/routes";
import Link from "next/link";
import React from "react";
import { appwrite, userState } from "store/global";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { UserMenu } from "./UserMenu";

interface NavOptionProps {
  href?: string
  [key: string]: any
}

const NavOption = ({ href, children, ...props }: React.PropsWithChildren<NavOptionProps>) => {
  const theme = useTheme()
  if(!href) {
    return <Typography sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}} variant='body2' {...props}>{children}</Typography>
  }
  return (
    <Link href={href}>
      <Typography sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}} variant='body2' {...props}>
        {children}
      </Typography>
    </Link>
  )
}

export const LayoutHeader = () => {
  const theme = useTheme()
  const { user, loading, setUser } = useUser()
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
    <Box p={2} borderBottom={`solid 1px  ${theme.palette.divider}`}>
      <Container maxWidth='lg'>
        <Stack direction='row' alignItems={'center'} justifyContent='space-between'>
          <Link href='/'>
            <img src="/img/logo.svg" alt="Badge.ar" height={56} />
          </Link>
          <Box>
            {loading ? <div /> : (
              user !== null ? (
                <Stack spacing={4} direction='row' alignItems={'center'}>
                    <UserMenu user={user} setUser={setUser} />
                </Stack>
              ) : (
                <Stack spacing={4} direction='row' alignItems={'center'}>
                  <NavOption href={pageRoutes.login}>
                    Log in
                  </NavOption>
                  <Link href={pageRoutes.createAnAccount}>
                    <Button variant='outlined'>
                      Sign up
                    </Button>
                  </Link>
                </Stack>
              )
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}