import { Typography } from "@mui/material";

// MDX components
export const mdxComponents = {
  h1: (props: any) => <Typography {...props} mt={4} mb={2} variant='h2' component='h1' />,
  h2: (props: any) => <Typography {...props} mt={4} mb={2} variant='h3' component='h2' />,
  h3: (props: any) => <Typography {...props} mt={4} mb={2} variant='h4' component='h3' />,
  h4: (props: any) => <Typography {...props} mt={4} mb={2} variant='h5' component='h4' />,
  p: (props: any) => <Typography {...props} my={2} variant='body1' />,
}