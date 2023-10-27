import "./index.scss";
import {Formik} from "formik";
import {Form, Image, Row, Col, Button} from "antd";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser from "@app/api/ApiUser";
import {useDispatch} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import {useRouter} from "next/router";
import Config from "@app/config";
import {IAccountInfo} from "@app/types";
import {ModalForgotPassword} from "../ForgotPassword";
import {
  getValidationSchema,
  // getValidationSchema,
  ILoginForm,
} from "@app/module/login/SignIn/form-config";
import {Input} from "formik-antd";
import FormItem from "@app/components/FormItem";
import {useState} from "react";

export function SignIn(): JSX.Element {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const loginMutation = useMutation(ApiUser.login);

  const handleLogin = (
    values: ILoginForm,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    loginMutation.mutate(
      {email: values.email, password: values.password},
      {
        onSuccess: (res: IAccountInfo) => {
          dispatch(loginUser({...res}));
          if (res.role === "store") {
            router.push(Config.PATHNAME.STORE);
          } else {
            router.push(Config.PATHNAME.HOME);
          }
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <>
      <Formik
        initialValues={{email: "", password: ""}}
        validateOnChange={false}
        validateOnBlur
        validationSchema={getValidationSchema()}
        onSubmit={handleLogin}
      >
        {({isSubmitting, handleSubmit}): JSX.Element => (
          <div className="container-sign-in">
            <Form onFinish={handleSubmit} className="container-sign-in">
              <div className="header-wrapper">
                <Image
                  className="login-image"
                  src="img/logo.svg"
                  preview={false}
                />
                <div className="login-text">Log in</div>
              </div>
              <FormItem
                className="text-login"
                name="email"
                label="Email"
                colon={false}
              >
                <Input
                  className="input-login"
                  name="email"
                  placeholder="Enter email"
                />
              </FormItem>
              <FormItem
                className="text-login"
                name="password"
                label="Password"
                colon={false}
              >
                <Input.Password
                  className="input-login"
                  name="password"
                  placeholder="Enter password"
                />
              </FormItem>
              <Row>
                <Col span={11} />
                <Col
                  span={11}
                  offset={2}
                  role="button"
                  tabIndex={0}
                  className="forgot-pass pt-1 text-right"
                  onClick={(): void => setIsModalOpen(true)}
                >
                  Forgot password?
                </Col>
              </Row>

              <ButtonSubmit
                label="Log in"
                isSubmitting={isSubmitting}
                classRow="log-in-text"
              />
              <div className="copy-right">
                <Button
                  type="link"
                  onClick={() => window.open("https://tinasoft.vn")}
                >
                  Powered by Tinasoft{" "}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
      <ModalForgotPassword
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
}
