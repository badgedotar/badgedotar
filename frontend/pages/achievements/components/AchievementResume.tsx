import { CategoryDocument, IUserBadge } from "@/src/utils/getSteamBadges"
import styled from "@emotion/styled"
import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { appwrite } from "store/global"

const AchImg = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
`

export interface IAchievementResume {
  badge: IUserBadge
  category: CategoryDocument
  onClick?: () => void
}

export const AchievementResume = ({
  badge,
  category,
  children,
  onClick
}: React.PropsWithChildren<IAchievementResume>) => {
  const url = appwrite.storage.getFileView('badges', badge.badgeData.$id)
  return (
    <Stack onClick={onClick} direction={'row'} alignItems='center' spacing={2} textAlign='left'>
      <AchImg src={url as any as string} />
      <Box flexGrow={1}>
        <Typography variant='h6'>{badge.badgeData.name}</Typography>
        <Typography variant='body2'>{category.name}</Typography>
        <Typography>{badge.badgeData.description}</Typography>
      </Box>
      {children &&
        <Box>
          {children}
        </Box>
      }
    </Stack>
  )
}