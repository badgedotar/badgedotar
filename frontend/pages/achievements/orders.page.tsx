import { useOrders } from "@/src/hooks/useOrders"
import { pageRoutes } from "@/src/routes"
import { withUser } from "@/src/utils/withUser"
import { Box, Container, Paper, Stack, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

const Page = () => {
  const { orders } = useOrders();
  return (
    <Box py={8}>
      <Container maxWidth='lg'>
        <Stack spacing={4}>
          <Typography variant="h4" component="h1">
            Order history
          </Typography>
          <TableContainer component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>msg</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.$id}>
                  <TableCell align="right">{order.$id}</TableCell>
                  <TableCell align="right">{order.status}</TableCell>
                  <TableCell align="right">{order.address}</TableCell>
                  <TableCell align="right">{order.msg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  )
}

export default withUser(Page, {
  params: {
    redirectTo: pageRoutes.login,
  }
})