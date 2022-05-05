import { Box, CircularProgress } from "@mui/material"
import useUser, { useUserParams } from "../hooks/useUser"

export interface withUserOptions {
  params?: useUserParams
  loadingComponent?: React.ReactNode
}

export const withUser = (Component: any, options: withUserOptions) => {
  const WithUser = (props: any) => {
    const { user, loading } = useUser(options?.params)
    const requiredUser = options?.params?.redirectTo;
    const requiredNullUser = options?.params?.redirectIfFound;
    if(loading) {
      return (
        options.loadingComponent || (
          <Box display='flex' justifyContent='center' alignItems='center' height='10rem'>
            <CircularProgress />
          </Box>
        )
      )
    }
    if(!user && requiredUser) {
      return (
        options.loadingComponent || (
          <Box display='flex' justifyContent='center' alignItems='center' height='10rem'>
            <CircularProgress />
          </Box>
        )
      )
    }
    if(user && requiredNullUser) {
      return (
        options.loadingComponent || (
          <Box display='flex' justifyContent='center' alignItems='center' height='10rem'>
            <CircularProgress />
          </Box>
        )
      )
    }
    return (
      <Component
        {...props}
        user={user}
      />
    )
  }
  WithUser.displayName = `withUser(${Component.displayName || Component.name || 'Component'})`
  return WithUser
}