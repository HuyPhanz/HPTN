import "./index.scss";
import {Form, Image, Input, Modal, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {RcFile, UploadProps} from "antd/es/upload";
import {UploadFile} from "antd/es/upload/interface";
import {IEventPrize} from "@app/types";
import ImgCrop from "antd-img-crop";
import {
  filterFileImage,
  handleBeforeUploadImage,
} from "@app/utils/helper/Upload";

interface ModalBannerProps {
  initPrize: IEventPrize[];
  onOk: (prize: IEventPrize) => void;
  isModalBannerOpen: boolean;
  setIsModalBannerOpen: () => void;
  indexPrize: number;
}

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

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function UploadModalBannerEvents(
  props: ModalBannerProps
): JSX.Element {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const initFormValue = {
    name: props.initPrize[props.indexPrize]?.name,
    description: props.initPrize[props.indexPrize]?.description,
    embed: props.initPrize[props.indexPrize]?.embed,
  };

  useEffect(() => {
    if (props.initPrize)
      setFileList([
        {uid: "", url: props.initPrize[props.indexPrize].image_data, name: ""},
      ]);
  }, [props.indexPrize]);

  const handleOk = async (): Promise<void> => {
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }

    if (!fileList.length) {
      setStatusError(true);
      return;
    }

    const values = form.getFieldsValue();

    if (fileList[0]?.originFileObj && fileList[0]?.thumbUrl) {
      props.onOk({
        ...values,
        image: fileList[0]?.originFileObj,
        image_data: fileList[0]?.thumbUrl,
      });
    } else {
      props.onOk({...props.initPrize[props.indexPrize], ...values});
    }

    form.resetFields();
    setFileList([]);
    props.setIsModalBannerOpen();
  };

  const handleCancel = () => {
    setStatusError(false);
    form.resetFields();
    setFileList([]);
    props.setIsModalBannerOpen();
    setPreviewOpen(false);
  };

  const handlePreviewBannerEvent = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({file}) => {
    if (file.status === "removed") {
      setFileList([]);
      setStatusError(true);
    } else {
      setStatusError(false);
      setFileList(filterFileImage([file]));
    }
  };

  const customRequestDefault: UploadProps["customRequest"] = (options) => {
    const {file, onSuccess} = options;
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(file);
      }
    }, 2000);
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
      <div style={{marginTop: 8, color: "#a32e8c"}}>Upload Image</div>
      <div style={{color: "#868686", fontSize: 10}}>
        Recommend size: 266 x 149 pixels{" "}
      </div>
    </div>
  );
  const [form] = Form.useForm();
  const [statusError, setStatusError] = useState<boolean>(false);
  return (
    <Modal
      title="Edit prize"
      width={800}
      open={props.isModalBannerOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-add-prize"
    >
      <div className="file-upload-container">
        <ImgCrop
          aspect={266 / 149}
          quality={0.8}
          beforeCrop={(file) => handleBeforeUploadImage(file)}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreviewBannerEvent}
            onChange={handleChange}
            customRequest={customRequestDefault}
            accept=".jpg, .png, .jpeg"
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        {statusError && <p className="text-red-500">Image is require!</p>}
        <Image
          alt="preview"
          src={previewImage}
          style={{display: "none"}}
          preview={{
            title: previewTitle,
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
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        style={{maxWidth: 700}}
        scrollToFirstError
        initialValues={initFormValue}
        colon={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input Event's name!",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input Event's description!",
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter description"
            showCount
            autoSize={{minRows: 4, maxRows: 6}}
            maxLength={255}
          />
        </Form.Item>
        <Form.Item
          name="embed"
          label="Embed Link"
          rules={[
            {
              required: true,
              message: "Please input Event's embed!",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Enter embed link" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
