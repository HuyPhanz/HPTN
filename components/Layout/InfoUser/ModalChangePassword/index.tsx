import "./index.scss";
import React, {useRef} from "react";
import {Button, Image, Modal} from "antd";
import {Formik} from "formik";
import {Input, Form} from "formik-antd";
import ApiUser, {IChangePasswordBody} from "@app/api/ApiUser";
import {useMutation} from "react-query";
import {useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";

interface IModalChangePassWork {
  isModalOpen: boolean;
  onOK: () => void;
  setIsModalOpen: (val: boolean) => void;
}
function ModalChangePassword(props: IModalChangePassWork) {
  const postChangePassword = useMutation(ApiUser.PostChangePassword);
  const userInfoId = useSelector((store: IRootState) => store?.user?.id);
  const formRef = useRef<any>(null);

  const handleSubmit = (value: IChangePasswordBody) => {
    props.setIsModalOpen(false);
    if (userInfoId !== undefined) {
      postChangePassword.mutate(
        {
          id: userInfoId,
          body: {
            old_password: value.old_password,
            new_password: value.new_password,
          },
        },
        {
          onSuccess: (res) => {
            Modal.success({
              className: "modal-success-container",
              icon: <div />,
              okText: "Log in",
              onOk() {
                ApiUser.logOut();
              },
              content: (
                <div>
                  <div>
                    <Image preview={false} src="/img/noti_change.svg" />
                  </div>
                </div>
              ),
            });
          },
          onError(e) {
            formRef?.current?.resetForm();
          },
        }
      );
    }
  };
  const handleCancel = () => {
    formRef?.current?.resetForm();
    props.setIsModalOpen(false);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{old_password: "", new_password: "", confirmPass: ""}}
      validate={(values) => {
        const errors: any = {};

        if (!values.old_password) {
          errors.old_password = "Old Password is required";
        }

        if (!values.new_password) {
          errors.new_password = "New Password is required";
        } else if (
          !/^([A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{6,65})?$/.test(
            values.new_password
          )
        ) {
          errors.new_password =
            "The password contains 6 to 65 characters. Please enter the correct format";
        }

        if (values.new_password !== values.confirmPass) {
          errors.confirmPass = "Passwords do not match";
        }

        return errors;
      }}
      validateOnBlur
      enableReinitialize
      onSubmit={(value) => handleSubmit(value)}
    >
      {({isSubmitting, handleSubmit, errors}): JSX.Element => (
        <Modal
          wrapClassName="modal-change-password"
          open={props.isModalOpen}
          onOk={props.onOK}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              // loading={loading}
              onClick={() => handleSubmit()}
            >
              Confirm
            </Button>,
          ]}
        >
          <div className="image-change">
            <Image
              className="login-image"
              width="30%"
              src="/img/logo.svg"
              preview={false}
            />
          </div>
          <h2 className="text-change">Change password</h2>
          <div className="container-change">
            <Form>
              <Form.Item
                className="text-password"
                name="old_password"
                label="Old Password"
                colon={false}
              >
                <Input.Password
                  name="old_password"
                  className="input-change-password"
                  placeholder="Enter old password"
                />
              </Form.Item>
              <Form.Item
                className="text-password"
                name="new_password"
                label="New Password"
                colon={false}
                validateStatus={errors.new_password ? "error" : ""}
                help={errors.new_password}
              >
                <Input.Password
                  name="new_password"
                  className="input-change-password"
                  placeholder="Enter password"
                />
              </Form.Item>
              <Form.Item
                className="text-password"
                name="confirmPass"
                label="Confirm Password"
                colon={false}
                validateStatus={errors.confirmPass ? "error" : ""}
                help={errors.confirmPass}
              >
                <Input.Password
                  name="confirmPass"
                  className="input-change-password"
                  placeholder="Enter password"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </Formik>
  );
}
export default ModalChangePassword;
