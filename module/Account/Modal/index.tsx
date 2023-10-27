import "./index.scss";
import {Modal, Form, Input, Select, Upload, notification, Image} from "antd";
import type {RcFile, UploadProps} from "antd/es/upload";
import type {UploadFile} from "antd/es/upload/interface";
import {IResponseDataStaff} from "@app/types";

import React, {useEffect, useState} from "react";
import {fetcher} from "@app/api/Fetcher";
import {loginUser} from "@app/redux/slices/UserSlice";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import ImgCrop from "antd-img-crop";
import {
  filterFileImage,
  handleBeforeUploadImage,
} from "@app/utils/helper/Upload";

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

const validateFullname = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Full name must not be empty"));
  }
  if (value.length < 1 || value.length > 55) {
    return Promise.reject(
      new Error("Full name must be between 1 and 55 characters")
    );
  }
  return Promise.resolve();
};

const validatePhoneNumber = (_: any, value: string) => {
  if (value.trim().includes(" ")) {
    return Promise.reject(
      new Error("Phone number cannot contain special characters")
    );
  }
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Phone number must not be empty"));
  }
  const phoneNumberRegex = /^\d{10,15}$/;
  if (!phoneNumberRegex.test(value)) {
    return Promise.reject(new Error("Phone number must have 10 to 15 digits"));
  }
  return Promise.resolve();
};

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
  initialAccountModal: IResponseDataStaff;
  refetch: () => void;
}

function LabelItemStyle(props: {label: string}): JSX.Element {
  return <span className="font-semibold">{props.label}</span>;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function ModalAccounts(props: IAccountModalProps): JSX.Element {
  const dispatch = useDispatch();
  const validatePassword = (_: any, value: string) => {
    if (!props.modalType && (!value || value.trim() === "")) {
      return Promise.reject(new Error("Password must not be empty"));
    }
    if (props.modalType && (!value || value.trim() === "")) {
      return Promise.resolve();
    }
    if (value.length > 0 && (value.length < 6 || value.length > 65)) {
      return Promise.reject(
        new Error("Password must be between 6 and 65 characters")
      );
    }
    if (value.length > 0 && value.includes(" ")) {
      return Promise.reject(new Error("Password must not contain whitespace"));
    }
    return Promise.resolve();
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userInfo = useSelector((store: IRootState) => store?.user);
  const [okButtonLoading, setOkButtonLoading] = useState(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    setFileList(filterFileImage(newFileList));
    form.setFieldsValue({image_data: file.originFileObj});
  };

  const uploadButton = (
    <div
      style={{display: "flex", flexDirection: "column", alignItems: "center"}}
    >
      <Image
        src="/img/upload-file.svg"
        width={56}
        height={56}
        alt="logo"
        preview={false}
      />
      <div style={{marginTop: 8, color: "#a32e8c"}}>Upload avatar</div>
    </div>
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isModalOpen) {
      form.setFieldsValue(props.initialAccountModal);
      if (props.initialAccountModal.avatar) {
        setFileList([
          {
            uid: props.initialAccountModal.avatar,
            url: props.initialAccountModal.avatar,
            name: "Staff Avatar",
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [props.isModalOpen]);

  const handleFinish = (values: {[key: string]: any}) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      } else if (fileList.length === 0) {
        formData.append("image_delete", "true");
      }
    });

    fetcher<any>({
      url: props.modalType
        ? `staff/update/${props.initialAccountModal.id}`
        : "/staff/create",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
              avatar: res.avatar,
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
  const customRequestDefault: UploadProps["customRequest"] = (options) => {
    const {file, onSuccess} = options;
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(file);
      }
    }, 1000);
  };
  return (
    <Modal
      title={props.modalType ? "Edit Staff" : "Add Staff"}
      width={820}
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
        style={{maxWidth: 700}}
        scrollToFirstError
        colon={false}
      >
        <Form.Item name="image_data">
          <div className="file-upload-container">
            <ImgCrop
              aspect={120 / 120}
              quality={0.8}
              beforeCrop={(file) => handleBeforeUploadImage(file)}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                maxCount={1}
                beforeUpload={() => {
                  return true;
                }}
                onChange={handleChange}
                onRemove={() => {
                  form.setFieldsValue({image_data: undefined});
                  setFileList([]);
                }}
                customRequest={customRequestDefault}
              >
                {fileList.length >= 1 ? undefined : uploadButton}
              </Upload>
            </ImgCrop>
            <Image
              alt="preview"
              src={previewImage}
              style={{display: "none"}}
              preview={{
                visible: previewOpen,
                className: "image-preview",
                src: `${previewImage}`,
                closeIcon: true,
                onVisibleChange: (value): void => {
                  setPreviewOpen(false);
                },
              }}
            />
          </div>
        </Form.Item>
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
          rules={[
            {
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="fullname"
          label={<LabelItemStyle label="Full name" />}
          rules={[
            {
              required: true,
              validator: validateFullname,
            },
          ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="phone"
          label={<LabelItemStyle label="Phone number" />}
          rules={[
            {
              required: true,
              validator: validatePhoneNumber,
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="role_id"
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
            onChange={(val) => form.setFieldsValue({role_id: val})}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: 1,
                label: "Admin",
              },
              {
                value: 3,
                label: "Staff",
              },
            ]}
            popupClassName="role-account"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
