import { Box, Typography } from "@mui/material"

export interface AmountDisplayProps {
  label: string
  total: number
  unit?: any
}

export const AmountDisplay = ({ label, total, unit = '₳'}: AmountDisplayProps) => {
  return (
    <Box>
      <Typography variant='body2'>{label}</Typography>
      <Typography variant='h3' fontWeight={800}>{total}{unit}</Typography>
    </Box>
  )
}