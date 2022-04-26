import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { users } from '../appwrite'

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  name: yup.string().required("Name is required"),
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { body } = req;

  // Validate the request body
  try {
    validationSchema.validateSync(body, { abortEarly: false });
    users.create('unique()', body.email, body.password, body.name).then(() => {
      res.status(200).send({ message: 'User created' })
    }).catch((err) => {
      console.log('EEEEE1', err);
      res.status(400).send({ message: 'ERROR' })
    })
  } catch (err: any) {
    console.log('EEEEE2', err);
    res.status(400).send({ message: err.message });
    return
  }
}

export default handler