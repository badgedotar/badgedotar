import { Check, EmailOutlined } from "@mui/icons-material";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import background from "./assets/retro.jpg";
import Image from "next/image";
import Link from "next/link";
import { pageRoutes } from "@/src/routes";

const Page = () => {
  return (
    <Box
      minHeight="90vh"
      display="flex"
      alignItems="center"
      textAlign="center"
      py={6}
      position='relative'
    >
      <Image
        src={background}
        layout="fill"
        objectFit="cover"
        objectPosition={"center"}
        style={{ opacity: 0.4 }}
      />
      <Container maxWidth="sm" sx={{ position: "relative" }}>
        <Card sx={{backgroundColor: "rgba(0,0,0,0.7)"}}>
          <Box p={4}>
            <Stack spacing={4} justifyContent="center" alignItems={"center"}>
              <Check sx={{ fontSize: "6rem" }} />
              <Typography pb={1} variant="h3" mr={4}>
                Your account was created
              </Typography>
              <Typography>Please. Login to continue.</Typography>
              <Link href={pageRoutes.login}>
                <Button variant='text' fullWidth>Log in</Button>
              </Link>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
