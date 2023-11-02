import * as Yup from "yup";
import {SchemaOf} from "yup";

export interface IEventFormValidation {
  name: string;
}

export function eventFormValidation(): SchemaOf<IEventFormValidation> {
  return Yup.object().shape({
    time: Yup.array().required("Time of event is require!").nullable(),
    name: Yup.string()
      .min(4, "The name contains at least 4 letters!")
      .max(50, "The name contains max 50 characters!")
      .required("The name is require!"),
    description: Yup.string().required("Description is require!"),
  });
}
