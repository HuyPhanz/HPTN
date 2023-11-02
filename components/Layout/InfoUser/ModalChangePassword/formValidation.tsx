import * as Yup from "yup";
import {SchemaOf} from "yup";

export interface IChangePasswordForm {
  old_password: string;
  new_password: string;
  confirmPass: string;
}

export function getValidationChangePassword(): SchemaOf<IChangePasswordForm> {
  return Yup.object().shape({
    old_password: Yup.string()
      .min(6, "The password contains at least 6 characters!")
      .max(65, "The password contains max 65 characters!")
      .required("Please do not leave blank!"),
    new_password: Yup.string()
      .min(6, "The new password contains at least 6 characters!")
      .max(65, "The new password contains max 65 characters!")
      .required("Please do not leave blank!")
      .matches(
        /(^([A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{6,65})?$)/,
        "Password contains invalid characters"
      ),
    confirmPass: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match!")
      .required("Please confirm your password!"),
  });
}
