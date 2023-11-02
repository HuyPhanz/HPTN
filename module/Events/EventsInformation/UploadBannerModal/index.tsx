import "./index.scss";
import {Modal, message, Upload, UploadProps, ModalProps} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import Banner from "@app/components/Banner";
import {useState} from "react";

export default function UploadBannerModal(props: ModalProps): JSX.Element {
  const {open, onOk, onCancel} = props;
  const {t} = useTranslation();
  const {Dragger} = Upload;

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    onChange(info) {
      const {status} = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      setFileUrl("/img/example-banner.png");
      return false;
    },
    showUploadList: false,
  };

  return (
    <Modal
      className="banner-upload-modal"
      title={t("modal.add_banner")}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Dragger className="dragger" {...uploadProps}>
        {fileUrl ? (
          <div className="flex justify-center">
            <Banner src={fileUrl} preview={false} />
          </div>
        ) : (
          <>
            {" "}
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t("modal.upload.title")}</p>
            <p className="ant-upload-hint">{t("modal.upload.describe")}</p>
          </>
        )}
      </Dragger>
    </Modal>
  );
}
