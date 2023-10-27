import * as Yup from "yup";
import {SchemaOf} from "yup";

export interface ILoginForm {
  email: string;
  password: string;
}

export function getValidationSchema(): SchemaOf<ILoginForm> {
  return Yup.object().shape({
    email: Yup.string()
      .email("Please enter the correct format!")
      .max(255, "The email contains max 255 characters!")
      .required("Please do not leave blank!"),
    password: Yup.string()
      .min(6, "The password contains max 6 characters!")
      .max(65, "The password contains max 65 characters!")
      .required("Please do not leave blank!"),
  });
}
