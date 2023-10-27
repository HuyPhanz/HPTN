import React, {useState} from "react";
import "./index.scss";
import {Modal, Input, ModalProps, Form, notification, Image} from "antd";
import ApiUser from "@app/api/ApiUser";
import CountdownTimer from "@app/utils/helper/CountdownTimer";
import {useForm} from "antd/lib/form/Form";

interface IForgotPasswordModalProps extends ModalProps {
  onSuccess?: (newPassword: string) => void;
}

export function ModalForgotPassword(
  props: IForgotPasswordModalProps
): JSX.Element {
  const [email, setEmail] = useState("");
  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validateConfirm, setValidateConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [form] = useForm();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const handleResetTimer = () => {
    setResetTimer((prevReset) => !prevReset); // Toggle the resetTimer state to trigger the reset
  };

  const handleClickSendCode = async () => {
    await form.validateFields().then(() => {
      if (!loading) {
        setLoading(true);
        setVerifyCode("");
        ApiUser.sendVerifyCode({email: email}, sendEmailSuccess)
          .then(() => {
            setSendEmailSuccess(true);
            handleResetTimer();
            setLoading(false);
            form.resetFields();
          })
          .catch(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleClickVerify = async () => {
    await form.validateFields().then(() => {
      if (verifyCode) {
        if (!loading) {
          setLoading(true);
          ApiUser.verifyCode({email: email, code: verifyCode})
            .then(() => {
              setVerifySuccess(true);
              notification.success({message: "Verify successfully!"});
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }
      } else {
        notification.error({message: "Invalid code!"});
      }
    });
  };

  const handleResetPassword = async () => {
    if (verifyCode) {
      if (confirmPassword !== newPassword) {
        setPasswordsMatch(false);
        setValidateConfirm(true);
      } else {
        setPasswordsMatch(true);
        setValidateConfirm(false);
        await form.validateFields().then(() => {
          if (!loading) {
            setLoading(true);
            ApiUser.resetPassword({
              email: email,
              code: verifyCode,
              new_password: newPassword,
            })
              .then(() => {
                notification.success({message: "Reset password successfully!"});
                if (props.onSuccess) {
                  props.onSuccess(newPassword);
                }
                handleReset();
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          }
        });
      }
    } else {
      notification.error({message: "Invalid code!"});
    }
  };

  function handleReset(): void {
    setConfirmPassword("");
    setNewPassword("");
    setEmail("");
    setVerifyCode("");
    setVerifySuccess(false);
    setSendEmailSuccess(false);
  }

  return (
    <Modal
      title={`${
        verifySuccess
          ? "Reset password"
          : sendEmailSuccess
          ? "OTP verification"
          : "Forgot password"
      }`}
      open={props.open}
      onCancel={(e) => {
        if (props.onCancel) {
          props.onCancel(e);
          handleReset();
        }
        form.resetFields();
      }}
      confirmLoading={loading}
      width={600}
      destroyOnClose
      okText={verifySuccess ? "Confirm" : "Send"}
      okButtonProps={{htmlType: "submit"}}
      onOk={() =>
        verifySuccess
          ? handleResetPassword()
          : sendEmailSuccess
          ? handleClickVerify()
          : handleClickSendCode()
      }
      wrapClassName="container-modal-forgot"
    >
      <div className="forgot-modal">
        {verifySuccess ? (
          <div className="image-newpass mt-4">
            <Image
              className="login-image"
              width={176}
              height={166}
              src="img/logo.svg"
              preview={false}
            />
          </div>
        ) : null}
        <h1
          className={`text-title text-center ${
            sendEmailSuccess && !verifySuccess ? "text-title-otp" : ""
          }`}
        >
          {verifySuccess
            ? "New password"
            : `${
                sendEmailSuccess
                  ? `We’ ve sent a verification code to your email ${email}`
                  : "We will send OTP code to this email !!"
              }`}
        </h1>

        {verifySuccess ? (
          <Form form={form} initialValues={{new_password: ""}}>
            <Form.Item
              name="new_password"
              label="New password"
              labelCol={{span: 24}}
              rules={[
                {required: true, message: "Please enter your password!"},
                {min: 6, max: 65, message: "Password length from 6 to 65!"},
              ]}
            >
              <Input.Password
                value={newPassword}
                placeholder="Enter password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Confirm password"
              labelCol={{span: 24}}
              name="confirm_password"
              help={
                validateConfirm ? (
                  <span className="text-red-500">Password mismatch!</span>
                ) : undefined
              }
              validateStatus={passwordsMatch ? "success" : "error"}
            >
              <Input.Password
                value={confirmPassword}
                placeholder="Enter password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordsMatch(e.target.value === newPassword);
                }}
              />
              {!passwordsMatch && (
                <div className="text-red-500">Password mismatch!</div>
              )}
            </Form.Item>
          </Form>
        ) : sendEmailSuccess ? (
          <div className="flex justify-center">
            <div className="flex flex-col w-[60%] text-center">
              <Form form={form}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your OTP!",
                    },
                  ]}
                  name="otp"
                  style={{textAlign: "left"}}
                >
                  <Input
                    value={verifyCode}
                    placeholder="Enter code"
                    onChange={(e) => setVerifyCode(e.target.value)}
                  />
                </Form.Item>
              </Form>
              <CountdownTimer initialTimeInSeconds={300} reset={resetTimer} />
              <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Haven't you received the OTP code?{" "}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <a
                  className="text-fuchsia-600"
                  onClick={() => {
                    handleClickSendCode();
                  }}
                >
                  Send back
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="send-email flex justify-center">
            <Form form={form}>
              <Form.Item
                className="w-[60%]"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
                name="email"
              >
                <Input
                  value={email}
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </Modal>
  );
}
