import { ListItem, ListItemText, Typography, useTheme } from "@mui/material"
import Link from "next/link"

interface MenuOptionProps {
  href?: string
  [key: string]: any
}

export const MenuOption = ({ href, children, ...props }: React.PropsWithChildren<MenuOptionProps>) => {
  const theme = useTheme()
  if(!href) {
    return (
      <ListItem {...props} sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}}>
        <ListItemText primary={children} />
      </ListItem>
    )
  }
  return (
    <Link href={href}>
      <ListItem {...props} sx={{cursor: 'pointer', ':hover': { color: theme.palette.primary.light }}}>
        <ListItemText primary={children} />
      </ListItem>
    </Link>
  )
}