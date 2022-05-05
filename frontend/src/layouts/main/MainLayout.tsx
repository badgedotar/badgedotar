import { Box } from "@mui/material"
import React from "react"
import { LayoutHeader } from "./LayoutHeader"

export const MainLayout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <Box>
      <LayoutHeader />
      {children}
    </Box>
  )
}