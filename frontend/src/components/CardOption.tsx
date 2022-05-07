import { SxProps, BoxProps, Box, Button, Stack, Typography } from "@mui/material"
import Link from "next/link"
import React from "react"

const buttonOptionsStyles: SxProps = {
  height: '100%',
  width: '100%',
  minHeight: '130px',
  minWidth: '130px',
}

export interface CardOptionProps extends BoxProps {
  href: string
  icon?: any
  disabled?: boolean
}

export const CardOption = ({ children, icon, href, disabled, ...props }: React.PropsWithChildren<CardOptionProps>) => {
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