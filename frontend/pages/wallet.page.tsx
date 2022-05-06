import { AmountDisplay } from "@/src/components/AmountDisplay"
import { IsLoading } from "@/src/components/IsLoading"
import { WalletAddress } from "@/src/components/WalletAddress"
import { useWallet } from "@/src/hooks/useWallet"
import { pageRoutes } from "@/src/routes"
import { withUser } from "@/src/utils/withUser"
import { Box, Card, Container, Stack, TextField, Typography } from "@mui/material"

const Page = () => {
  const { wallet, loading, reload} = useWallet()
  if(loading || !wallet) {
    return ( <IsLoading /> );
  }
  return (
    <Box py={4}>
      <Container>
        <Card>
          <Box padding={4}>
            <Stack spacing={4}>
              <Typography variant="h3">Wallet</Typography>
              <AmountDisplay
                label="Balance"
                total={wallet.balance}
              />
              <WalletAddress address={wallet.address} />
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default withUser(Page, {
  params: {
    redirectTo: pageRoutes.login
  }
})