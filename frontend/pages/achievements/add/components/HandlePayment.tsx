import { AmountDisplay } from "@/src/components/AmountDisplay"
import { IsLoading } from "@/src/components/IsLoading"
import { WalletAddress } from "@/src/components/WalletAddress"
import { useWallet } from "@/src/hooks/useWallet"
import { IUserBadge } from "@/src/utils/getSteamBadges"
import { Done, EmojiEventsTwoTone } from "@mui/icons-material"
import { Box, Button, Card, Dialog, Divider, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { UserLogged } from "../../../../store/types"
import { appwrite } from "store/global";
import { useState } from "react"
import { calculatePrice } from "@/src/utils/paymentCalculation"
import Link from "next/link"
import { pageRoutes } from "@/src/routes"

interface HandlePaymentProps {
  user: UserLogged
  userBadges: IUserBadge[]
}

export const HandlePayment = ({ user, userBadges }: HandlePaymentProps) => {
  const {wallet, loading: walletLoading, reload: reloadWallet} = useWallet(user)

  const [isPaying, setIsPaying] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [destination, setDestination] = useState("");

  const generateOrder = async () => {
    const order = await appwrite.database.createDocument('orders', 'unique()', {
      minted: false,
      userBadges: [
        ...userBadges.map(badge => badge.$id),
      ],
      user: user.$id,
      address: destination,
      status: 'new',
    }, [`user:${user.$id}`]).catch((e) => {
      console.error(e)
    })
    setOrderCreated(true)
  }

  const onDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  }

  const handlePay = () => {
    setIsPaying(true);
    generateOrder()
  }

  const ammountInWallet = wallet?.balance || 0;
  
  const totalToPay = calculatePrice(userBadges.length);
  const pendingToAdd: number = +(totalToPay - ammountInWallet).toFixed(2);
  const userCanPay: boolean = pendingToAdd <= 0;

  console.log({
    walletLoading,
    wallet,
    isPaying,
  })

  if(orderCreated) {
    return (
      <>
        <IsLoading />
        <Dialog open={true}>
          <Box p={4}>
            <Stack spacing={4} alignItems='center'>
              <Done fontSize='large' />
              <Typography variant='h4'>Your order was created!</Typography>
              <Link href={pageRoutes.orders}>
                <Button>Go to my orders</Button>
              </Link>
            </Stack>
          </Box>
        </Dialog>
      </>
    )
  }

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
          <Typography>Note: 2 ADAs from your payment will be sended to your destination wallet with the minted NFTs.</Typography>
          <Divider />
          <TextField label='Destination address' helperText='Enter the address where the NFTs will be sended.' sx={{flexGrow: 1}} value={destination} onChange={onDestinationChange}/>
          <Divider />
          <Button onClick={handlePay} variant='contained' disabled={!destination.length}>Pay</Button>
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
          <Typography>Can take several minutes to refresh the new balance.</Typography>
        </Stack>
      }
    </Stack>
  )
}