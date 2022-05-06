import { AmountDisplay } from "@/src/components/AmountDisplay"
import { IsLoading } from "@/src/components/IsLoading"
import { WalletAddress } from "@/src/components/WalletAddress"
import useIsMounted from "@/src/hooks/useIsMounted"
import { useWallet } from "@/src/hooks/useWallet"
import { IUserBadge } from "@/src/utils/getSteamBadges"
import { CopyAllOutlined, EmojiEventsTwoTone } from "@mui/icons-material"
import { Box, Button, Card, Divider, Stack, TextField, Tooltip, Typography } from "@mui/material"

import { useState } from "react"

interface HandlePaymentProps {
  userBadges: IUserBadge[]
}

export const HandlePayment = ({ userBadges }: HandlePaymentProps) => {
  const {wallet, loading: walletLoading, reload: reloadWallet} = useWallet()

  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    // TODO create a lambda function to create orders
    console.log('To mint', userBadges);
  }

  const basePrice = 2;
  const pricePerBadge = 0.5;
  const ammountInWallet = wallet?.balance || 0;

  const totalToPay = basePrice + (pricePerBadge * userBadges.length);
  const pendingToAdd: number = +(totalToPay - ammountInWallet).toFixed(2);
  const userCanPay: boolean = pendingToAdd <= 0;

  if(walletLoading) {
    return ( <IsLoading /> );
  }
  if(wallet === null) {
    return ( <IsLoading /> );
  }
  if(isPaying) {
    return ( <IsLoading /> );
  }
  return (
    <Stack spacing={4}>
      {userCanPay ? 
        <Stack spacing={4}>
          <Typography>Press pay to mint your achievements using ADA from your wallet.</Typography>
          <Stack direction='row' spacing={4}>
            <AmountDisplay label='Your wallet:' total={ammountInWallet} />
            <AmountDisplay label='Total to pay:' total={totalToPay} />
            <AmountDisplay label='You will mint:' total={userBadges.length} unit={<EmojiEventsTwoTone fontSize="large" />} />
          </Stack>
          <Divider />
          <Button onClick={handlePay} variant='contained'>Pay</Button>
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
              <WalletAddress address={wallet.address} />
              <Button onClick={reloadWallet}>Reload wallet</Button>
            </Stack>
          </Card>
        </Stack>
      }
    </Stack>
  )
}