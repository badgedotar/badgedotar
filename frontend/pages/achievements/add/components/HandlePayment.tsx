import { IsLoading } from "@/src/components/IsLoading"
import useIsMounted from "@/src/hooks/useIsMounted"
import { useWallet } from "@/src/hooks/useWallet"
import { IUserBadge } from "@/src/utils/getSteamBadges"
import { CopyAllOutlined, EmojiEventsTwoTone } from "@mui/icons-material"
import { Box, Button, Card, Container, Divider, Stack, TextField, Tooltip, Typography } from "@mui/material"
import copy from 'clipboard-copy'
import { useState } from "react"
import { appwrite } from "store/global"

interface AmountDisplayProps {
  label: string
  total: number
  unit?: any
}

const AmountDisplay = ({ label, total, unit = '₳'}: AmountDisplayProps) => {
  return (
    <Box>
      <Typography variant='body2'>{label}</Typography>
      <Typography variant='h3' fontWeight={800}>{total}{unit}</Typography>
    </Box>
  )
}

interface HandlePaymentProps {
  userBadges: IUserBadge[]
}

export const HandlePayment = ({ userBadges }: HandlePaymentProps) => {
  const isMounted = useIsMounted()
  const {wallet, loading: walletLoading, reload: reloadWallet} = useWallet()

  const [copiedMessage, setCopiedMessage] = useState('Copy to clipboard')
  const copyToClipboard = () => {
    copy(wallet?.address || '')
    setCopiedMessage('Copied!')
    setTimeout(() => {
      if (isMounted()) {
        setCopiedMessage('Copy to clipboard')
      }
    }, 2000)
  }

  const basePrice = 2
  const pricePerBadge = 0.5
  const ammountInWallet = wallet?.balance || 0

  const totalToPay = basePrice + (pricePerBadge * userBadges.length);
  const pendingToAdd: number = +(totalToPay - ammountInWallet).toFixed(2);
  const userCanPay: boolean = pendingToAdd <= 0;

  if(walletLoading) {
    return ( <IsLoading /> )
  }
  if(wallet === null) {
    return ( <IsLoading /> )
  }
  return (
    <Stack spacing={4}>
      {userCanPay ? 
        <Stack spacing={4}>
          <Typography>Press pay to mint your achievements using ADA from your wallet.</Typography>
          <Stack direction='column' spacing={4}>
            <AmountDisplay label='Your wallet:' total={ammountInWallet} />
            <AmountDisplay label='Total to pay:' total={totalToPay} />
            <AmountDisplay label='You will mint:' total={userBadges.length} unit={<EmojiEventsTwoTone fontSize="large" />} />
          </Stack>
          <Divider />
          <Button variant='contained'>Pay</Button>
        </Stack>
        :
        <Stack spacing={4}>
          <Typography>IMPORTANT: You must add ADA to your account in order to mint your awards.</Typography>
          <Card variant='outlined'>
            <Box p={2}>
              <Stack direction='row' spacing={8}>
                <AmountDisplay label='Total to pay:' total={totalToPay} />
                <AmountDisplay label='In your wallet:' total={ammountInWallet} />
              </Stack>
            </Box>
          </Card>
          <Typography>Transfer ADA into the address below.</Typography>
          <Card variant='outlined'>
            <Stack p={2} spacing={2}>
              <AmountDisplay label='Amount to transfer:' total={pendingToAdd} />
              <Stack direction='row' spacing={{xs: 2, sm: 4}}>
                <TextField label='Wallet address' sx={{flexGrow: 1}} value={wallet.address} />
                <Tooltip title={copiedMessage}>
                  <Button onClick={copyToClipboard} variant='contained'><CopyAllOutlined/></Button>
                </Tooltip>
              </Stack>
              <Button onClick={reloadWallet}>Reload wallet</Button>
            </Stack>
          </Card>
        </Stack>
      }
    </Stack>
  )
}