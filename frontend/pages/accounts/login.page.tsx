import Link from "@/src/Link";
import * as yup from "yup";
import { pageRoutes } from "@/src/routes";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import background from './assets/tunnel.jpg';
import Image from "next/image";
import { useRecoilState } from "recoil";
import { appwrite, userState } from "store/global";
import { User } from "store/types";
import useUser from "@/src/hooks/useUser";

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Page = () => {
  const {  setUser, loading } = useUser({'redirectIfFound': pageRoutes.home});

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const router = useRouter();

  const onSubmit = (
    { email, password }: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    actions.setSubmitting(true);
    appwrite.account
    .createSession(email, password)
      .then((data) => {
        console.log(data)
        setUser(data as any as User);
        router.push(pageRoutes.achievementsAddSelect);
      })
      .catch((error) => {
        console.error(error?.message);
        actions.setSubmitting(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <Box minHeight="90vh" display="flex" alignItems="center" py={6}>
      <Image src={background} layout='fill' objectFit="cover" style={{opacity: 0.2}} />
      <Container maxWidth="sm" sx={{position:'relative'}}>
        <Typography variant="h3" mb={2}>
          Login
        </Typography>
        <Typography mb={4}>
          You don't have an account yet?{" "}
          <Link href={pageRoutes.createAnAccount}>Register</Link>
        </Typography>
        <Card>
          <Box p={4}>
            <Typography mb={4}>Login with your email and password</Typography>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <TextField
                  placeholder="email"
                  type="email"
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  placeholder="password"
                  type="password"
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button type="submit">Sign in</Button>
              </Stack>
            </form>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
