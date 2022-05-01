import useIsMounted from "@/src/hooks/useIsMounted"
import { CopyAllOutlined } from "@mui/icons-material"
import { Box, Button, Card, Container, Divider, Stack, TextField, Tooltip, Typography } from "@mui/material"
import copy from 'clipboard-copy'
import { useState } from "react"

interface AmountDisplayProps {
  label: string
  total: number
}

const AmountDisplay = ({ label, total }: AmountDisplayProps) => {
  return (
    <Box>
      <Typography variant='body2'>{label}</Typography>
      <Typography variant='h3' fontWeight={800}>{total}₳</Typography>
    </Box>
  )
}

const Page = () => {
  const totalToPay = 4.26;
  const userTotal = 3;
  const pendingToAdd: number = +(totalToPay - userTotal).toFixed(2);
  const userCanPay: boolean = pendingToAdd <= 0;
  const userWallet = '14128312yu3138921ahdjksalhdsjakldsahjkladhjsaklds';

  const isMounted = useIsMounted()

  const [copiedMessage, setCopiedMessage] = useState('Copy to clipboard')
  const copyToClipboard = () => {
    copy(userWallet)
    setCopiedMessage('Copied!')
    setTimeout(() => {
      if (isMounted()) {
        setCopiedMessage('Copy to clipboard')
      }
    }, 2000)
  }
  return (
    <Box
      minHeight="90vh"
      display="flex"
      alignItems="center"
      py={6}
    >
      <Container maxWidth='sm'>
        <Stack spacing={4}>
          <Typography variant='h3'>Handle payment</Typography>
          {userCanPay ? 
            <Stack spacing={4}>
              <Typography>Press pay to mint your achievements with the ADA in your wallet.</Typography>
              <AmountDisplay label='Your wallet:' total={userTotal} />
              <AmountDisplay label='Total to pay:' total={totalToPay} />
              <Divider />
              <Button variant='contained'>Pay</Button>
            </Stack>
            :
            <Stack spacing={4}>
              <Typography>IMPORTANT: You must add ADA to your account in order to mint your awards.</Typography>
              <Card>
                <Box p={2}>
                  <Stack direction='row' spacing={8}>
                    <AmountDisplay label='Total to pay:' total={totalToPay} />
                    <AmountDisplay label='In your wallet:' total={userTotal} />
                  </Stack>
                </Box>
              </Card>
              <Typography>Transfer ADA into the account below.</Typography>
              <Card>
                <Stack p={2} spacing={2}>
                  <AmountDisplay label='You must add into your wallet:' total={pendingToAdd} />
                  <Stack direction='row' spacing={4}>
                    <TextField label='Wallet address' sx={{flexGrow: 1}} value={userWallet} />
                    <Tooltip title={copiedMessage}>
                      <Button onClick={copyToClipboard} variant='contained'><CopyAllOutlined/></Button>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          }
        </Stack>
      </Container>
    </Box>
  )
}

export default Page