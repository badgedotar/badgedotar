import { CopyAllOutlined } from "@mui/icons-material"
import { Button, Stack, TextField, Tooltip } from "@mui/material"
import { useState } from "react"
import useIsMounted from "../hooks/useIsMounted"
import copy from 'clipboard-copy'

export interface WalletAddressProps {
  address: string
}

export const WalletAddress = ({address}: WalletAddressProps) => {
  const isMounted = useIsMounted()
  const [copiedMessage, setCopiedMessage] = useState('Copy to clipboard')
  const copyToClipboard = () => {
    copy(address || '')
    setCopiedMessage('Copied!')
    setTimeout(() => {
      if (isMounted()) {
        setCopiedMessage('Copy to clipboard')
      }
    }, 2000)
  }
  return (
    <Stack direction='row' spacing={{xs: 2, sm: 4}}>
      <TextField label='Wallet address' sx={{flexGrow: 1}} value={address} />
      <Tooltip title={copiedMessage}>
        <Button onClick={copyToClipboard} variant='contained'><CopyAllOutlined/></Button>
      </Tooltip>
    </Stack>
  )
}