import { Box, BoxProps, CircularProgress } from "@mui/material"

export const IsLoading = (props: BoxProps) => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='10rem' {...props}>
      <CircularProgress />
    </Box>
  )
}