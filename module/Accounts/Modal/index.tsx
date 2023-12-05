import "./index.scss";
import {Modal, Form, Input, Select, notification} from "antd";
import {IResponseDataAccounts} from "@app/types";

import React, {useEffect, useState} from "react";
import {fetcher} from "@app/api/Fetcher";
import {loginUser} from "@app/redux/slices/UserSlice";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import {useQuery} from "react-query";
import ApiStore, {IStoreTableResponse} from "@app/api/ApiStore";

const validateEmail = (_: any, value: string) => {
  // const lenghtRegex = /^[a-z0-9+_.-]{2,65}@/i;
  const emailRegex =
    /^([a-zA-Z0-9+_.-]{2,65})(\.[a-zA-Z0-9+_-]{2,65})*@([a-zA-Z0-9-]{2,65}\.)+[a-zA-Z]{2,6}$/;
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Email must not be empty"));
  }
  // if (!lenghtRegex.test(value)) {
  //   return Promise.reject(new Error("Needs at least 2 characters before @"));
  // }
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error("Email is invalid"));
  }
  if (value.length > 65) {
    return Promise.reject(new Error("Email must not exceed 65 characters"));
  }
  return Promise.resolve();
};

// const validatePhoneNumber = (_: any, value: string) => {
//   if (value.trim().includes(" ")) {
//     return Promise.reject(
//       new Error("Phone number cannot contain special characters")
//     );
//   }
//   if (!value || value.trim() === "") {
//     return Promise.reject(new Error("Phone number must not be empty"));
//   }
//   const phoneNumberRegex = /^\d{10,15}$/;
//   if (!phoneNumberRegex.test(value)) {
//     return Promise.reject(new Error("Phone number must have 10 to 15 digits"));
//   }
//   return Promise.resolve();
// };

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};
interface IAccountModalProps {
  isModalOpen: boolean;
  modalType: boolean;
  handleOk: () => void;
  onCancel: () => void;
  initialAccountModal: IResponseDataAccounts;
  refetch: () => void;
}

function LabelItemStyle(props: {label: string}): JSX.Element {
  return <span className="font-semibold">{props.label}</span>;
}

export function ModalAccounts(props: IAccountModalProps): JSX.Element {
  const dispatch = useDispatch();
  // const validatePassword = (_: any, value: string) => {
  //   if (!props.modalType && (!value || value.trim() === "")) {
  //     return Promise.reject(new Error("Password must not be empty"));
  //   }
  //   if (props.modalType && (!value || value.trim() === "")) {
  //     return Promise.resolve();
  //   }
  //   if (value.length > 0 && (value.length < 6 || value.length > 65)) {
  //     return Promise.reject(
  //       new Error("Password must be between 6 and 65 characters")
  //     );
  //   }
  //   if (value.length > 0 && value.includes(" ")) {
  //     return Promise.reject(new Error("Password must not contain whitespace"));
  //   }
  //   return Promise.resolve();
  // };

  const userInfo = useSelector((store: IRootState) => store?.user);
  const [okButtonLoading, setOkButtonLoading] = useState(false);

  const listUnassignedStores = useQuery<IStoreTableResponse[]>(
    ["list-account"],
    () => ApiStore.getListUnassignedStore()
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isModalOpen) {
      console.log(props.initialAccountModal);
      form.setFieldsValue({
        ...props.initialAccountModal,
        store: props.initialAccountModal.store?.id,
      });
    }
  }, [props.isModalOpen]);

  const handleFinish = (values: {[key: string]: any}) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    fetcher<any>({
      url: `/users${props.modalType ? `/${props.initialAccountModal.id}` : ""}`,
      method: props.modalType ? "patch" : "post",
      data: values,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    })
      .then((res) => {
        if (
          props.modalType &&
          props.initialAccountModal.id &&
          props.initialAccountModal.id === userInfo.id
        ) {
          dispatch(
            loginUser({
              ...userInfo,
              display_name: res.fullname,
            })
          );
        }
        notification.success({
          message: props.modalType
            ? "Update successfully!"
            : "Create successfully!",
        });
        form.resetFields();
        props.handleOk();
        props.refetch();
        setOkButtonLoading(false);
        listUnassignedStores.refetch();
      })
      .catch((e) => {
        console.log(e);
        setOkButtonLoading(false);
      });
  };

  const handleOk = async () => {
    try {
      await form.validateFields(); // Validate the form fields
      setOkButtonLoading(true);
      form.submit(); // Manually trigger the form submission, which will call handleFinish
    } catch (error) {
      console.log("Form validation error:", error);
      setOkButtonLoading(false);
    }
  };

  return (
    <Modal
      title={props.modalType ? "Edit Staff" : "Add Staff"}
      width={620}
      okText={props.modalType ? "Save" : "OK"}
      open={props.isModalOpen}
      onOk={() => handleOk()}
      okButtonProps={{loading: okButtonLoading}}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
      className="add-acc-modal"
      destroyOnClose
    >
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleFinish}
        name="register"
        style={{maxWidth: 600}}
        scrollToFirstError
        colon={false}
      >
        <Form.Item
          name="email"
          label={<LabelItemStyle label="Email" />}
          rules={[
            {
              required: true,
              validator: validateEmail,
            },
          ]}
        >
          <Input placeholder="Enter email" disabled={props.modalType} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<LabelItemStyle label="Password" />}
          // rules={[
          //   {
          //     validator: validatePassword,
          //   },
          // ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="role"
          label={<LabelItemStyle label="Role" />}
          rules={[
            {
              required: true,
              message: "Please select your categories!",
            },
          ]}
        >
          <Select
            placeholder="Select role"
            optionFilterProp="children"
            onChange={(val) => form.setFieldsValue({role: val})}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "admin",
                label: "Admin",
              },
              {
                value: "staff",
                label: "Staff",
              },
            ]}
            popupClassName="role-account"
          />
        </Form.Item>
        <Form.Item
          name="store"
          label={<LabelItemStyle label="Store" />}
          rules={[
            {
              required: true,
              message: "Please select your store!",
            },
          ]}
        >
          <Select
            placeholder="Select store"
            optionFilterProp="children"
            onChange={(val) => form.setFieldsValue({store: val})}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              listUnassignedStores.data?.map((store) => ({
                value: store.id,
                label: store.name,
              })) ?? []
            }
            popupClassName="role-account"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
