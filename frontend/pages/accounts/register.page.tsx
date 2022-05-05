import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { pageRoutes } from "@/src/routes";
import Link from "@/src/Link";
import background from './assets/dice.jpg';
import Image from "next/image";
import { appwrite } from "store/global";

interface FormValues {
  email: string;
  password: string;
  repeatPassword: string;
  name: string;
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
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Repeat password is required"),
  name: yup.string().required("Name is required"),
});

const Page = () => {
  const initialValues: FormValues = {
    email: "",
    password: "",
    repeatPassword: "",
    name: "",
  };
  const router = useRouter();

  const onSubmit = (
    { email, password, name }: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    actions.setSubmitting(true);
    appwrite.account.create('unique()', email, password, name).then(() => {
      router.push(pageRoutes.confirmAccount);
    }).catch((error) => {
      console.error(error?.message);
      actions.setSubmitting(false);
    });
    // axios
    //   .post("/api/accounts/register", {
    //     email,
    //     password,
    //     name,
    //   })
    //   .then(() => {
    //     router.push(pageRoutes.confirmAccount);
    //   })
    //   .catch((error) => {
    //     console.error(error?.message);
    //     actions.setSubmitting(false);
    //   });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Box minHeight="90vh" display="flex" alignItems="center" py={6} position='relative'>
      <Image src={background} layout='fill' objectFit="cover" style={{opacity: 0.1}} />
      <Container maxWidth="sm" sx={{position:'relative'}}>
        <Typography variant="h3" mb={2}>
          Create an account
        </Typography>
        <Typography mb={4}>
          Already have an account? <Link href={pageRoutes.login}>Register</Link>
        </Typography>
        <Card>
          <Box p={4}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  name="repeatPassword"
                  value={formik.values.repeatPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.repeatPassword &&
                    Boolean(formik.errors.repeatPassword)
                  }
                  helperText={
                    formik.touched.repeatPassword &&
                    formik.errors.repeatPassword
                  }
                />
                <TextField
                  label="Your name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <Button type="submit" disabled={formik.isSubmitting}>
                  Register
                </Button>
              </Stack>
            </form>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Page;
