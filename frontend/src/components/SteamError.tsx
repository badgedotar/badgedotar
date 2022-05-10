import { Box, Container, Stack, Typography, Breadcrumbs, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler } from "react";
import steamConfig from './assets/steamConfig.jpg'

interface SteamErrorProps {
  error: string | null
  handleRetry: MouseEventHandler<HTMLButtonElement>
}

export const SteamError = ({error, handleRetry}: SteamErrorProps) => {
  const steamLink = `https://steamcommunity.com/my/edit/settings`
  const privateProfileError = error === "This account is private.";
  return (
    <Box py={8}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Typography variant="h4">
            {error}
          </Typography>
          {privateProfileError && (
            <>
            <Typography variant="body1">
              You must set your profile and game details to public in your Steam profile.
            </Typography>
            <Link href={steamLink}>
              <a target='_blank' style={{textDecoration: 'none'}}>
                <Breadcrumbs separator="›">
                  <Typography>Steam</Typography>
                  <Typography>Profile</Typography>
                  <Typography>Edit Profile</Typography>
                  <Typography><b><u>My privacy settings</u></b></Typography>
                </Breadcrumbs>
              </a>
            </Link>
            <Box>
              <Image
                layout="responsive"
                src={steamConfig}
                width={974}
                height={515}
              />
            </Box>
            </>
          )}
          <Button variant="contained" color="primary" onClick={handleRetry}>Retry</Button>
        </Stack>
      </Container>
    </Box>
  )
}