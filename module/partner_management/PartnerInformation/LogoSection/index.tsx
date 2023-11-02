import "./index.scss";
import {Image, notification, Spin, Upload, UploadFile} from "antd";
import ImgCrop from "antd-img-crop";
import React from "react";
import {UploadProps} from "antd/es/upload";
import {IPartnerForm} from "@app/types";

interface ILogoSectionProps {
  loading: boolean;
  isPreview: boolean;
  logo: UploadFile[];
  initValues?: IPartnerForm;
  onChange: UploadProps["onChange"];
  onRemove: UploadProps["onRemove"];
}

const uploadButton = (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
    <Image
      src="/img/upload-file.svg"
      width={56}
      height={56}
      alt="logo"
      preview={false}
    />
    <div style={{marginTop: 8, color: "#a32e8c"}}>Upload Logo</div>
    <div style={{color: "gray"}}>120x120</div>
  </div>
);

const customRequestDefault: UploadProps["customRequest"] = (options) => {
  const {file, onSuccess} = options;
  setTimeout(() => {
    if (onSuccess) {
      onSuccess(file);
    }
  }, 2000);
};

const beforeCrop: UploadProps["beforeUpload"] = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  const isLt10M = file.size! / 1024 / 1024 < 10;

  if (!isJpgOrPng) {
    notification.error({
      message: "You can only upload JPG/PNG/JPEG file!",
    });
    return false;
  }

  if (!isLt10M) {
    notification.error({
      message: "Image must be smaller than 10MB!",
    });
    return false;
  }
  return true;
};

export default function LogoSection(props: ILogoSectionProps): JSX.Element {
  const {loading, logo, onChange, onRemove, isPreview, initValues} = props;

  return (
    <div className="company-info">
      {loading ? (
        <div className="flex justify-center items-center h-[20vh] w-[100%]">
          <Spin />
        </div>
      ) : (
        <>
          <div className="background-image">
            <Image src="/img/header-background.png" preview={false} />
          </div>
          <div className="logo">
            {isPreview ? (
              <div className="flex max-w-[100%]">
                {" "}
                <div className="w-[120px] h-[120px] rounded overflow-hidden">
                  <Image
                    src={
                      logo.length > 0
                        ? logo[0]?.url ?? "/img/default-logo.png"
                        : initValues?.logo?.url ?? "/img/default-logo.png"
                    }
                    width={120}
                    height={120}
                    fallback="/img/default-logo.png"
                  />
                </div>
                <div className="max-w-[80%] flex flex-col ml-3 justify-center">
                  <h1 className="max-w-[100%] ">
                    {initValues?.name ?? "Unknown Store"}
                  </h1>
                </div>
              </div>
            ) : (
              <ImgCrop aspect={120 / 120} quality={0.9} beforeCrop={beforeCrop}>
                <Upload
                  listType="picture-card"
                  accept=".jpg, .jpeg, .png"
                  maxCount={1}
                  multiple={false}
                  fileList={logo}
                  onChange={(info) => {
                    if (info.file.status && onChange) {
                      onChange(info);
                    }
                  }}
                  onRemove={onRemove}
                  showUploadList={{showPreviewIcon: false}}
                  customRequest={customRequestDefault}
                >
                  {logo.length === 0 ? uploadButton : undefined}
                </Upload>
              </ImgCrop>
            )}
          </div>
        </>
      )}
    </div>
  );
}
