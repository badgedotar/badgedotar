import styled from "@emotion/styled"
import { Box, Stack, Typography } from "@mui/material"
import React from "react"

const AchImg = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
`

export interface IAchievementResume {
  id: string
  title: string
  description: string
  image: string
  onClick?: () => void
}

export const AchievementResume = ({
  title,
  description,
  image,
  children,
  onClick
}: React.PropsWithChildren<IAchievementResume>) => {
  return (
    <Stack onClick={onClick} direction={'row'} alignItems='center' spacing={2} textAlign='left'>
      <AchImg src={image} />
      <Box flexGrow={1}>
        <Typography variant='h6'>{title}</Typography>
        <Typography>{description}</Typography>
      </Box>
      {children &&
        <Box>
          {children}
        </Box>
      }
    </Stack>
  )
}