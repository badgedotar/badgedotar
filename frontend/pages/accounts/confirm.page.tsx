import { EmailOutlined } from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import background from "./assets/retro.jpg";
import Image from "next/image";

const Page = () => {
  return (
    <Box
      minHeight="90vh"
      display="flex"
      alignItems="center"
      textAlign="center"
      py={6}
    >
      <Image
        src={background}
        layout="fill"
        objectFit="cover"
        objectPosition={"center"}
        style={{ opacity: 0.4 }}
      />
      <Container sx={{ position: "relative" }}>
        <Stack spacing={4} justifyContent="center" alignItems={"center"}>
          <EmailOutlined sx={{ fontSize: "6rem" }} />
          <Typography pb={1} variant="h3" mr={4}>
            Confirm your account
          </Typography>
          <Typography>Check your email to confirm your account.</Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Page;
