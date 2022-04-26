import { Box, Button, Container, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { Formik, FormikHelpers, useFormik } from "formik";
import { appwrite } from "store/global";
import { useRouter } from "next/router";

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

  const  onSubmit =(
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    actions.setSubmitting(true);
    appwrite.account.create('unique()', values.email, values.password, values.name).then(() => {
      router.push("/");
    }).catch(error => {
      console.error(error?.message);
      actions.setSubmitting(false);
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h3">Create an account</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box mt={4} display="grid" sx={{ gridGap: "20px" }}>
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
            error={formik.touched.password && Boolean(formik.errors.password)}
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
              formik.touched.repeatPassword && formik.errors.repeatPassword
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
        </Box>
      </form>
    </Container>
  );
};

export default Page;
