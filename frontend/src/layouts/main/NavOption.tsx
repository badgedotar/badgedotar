import { MenuItem, Typography, useTheme } from "@mui/material"
import Link from "next/link"

interface NavOptionProps {
  href?: string
  [key: string]: any
}

export const NavOption = ({ href, children, ...props }: React.PropsWithChildren<NavOptionProps>) => {
  const theme = useTheme()
  if(!href) {
    return (
      <MenuItem sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}}>
        <Typography variant='body2' {...props}>{children}</Typography>
      </MenuItem>
    )
  }
  return (
    <MenuItem sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}}>
      <Link href={href}>
        <Typography variant='body2' {...props}>
          {children}
        </Typography>
      </Link>
    </MenuItem>
  )
}