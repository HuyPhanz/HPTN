import "./index.scss";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Form, Image, notification, Upload} from "antd";
import type {RcFile, UploadProps} from "antd/es/upload";
import type {UploadFile} from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import classNames from "classnames";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {
  filterFileImage,
  handleBeforeUploadImage,
} from "@app/utils/helper/Upload";

interface IBannerList {
  onRemove: (removedFiles?: number[]) => void;
  initBanner: UploadFile[];
  isPreview: boolean;
  onChange: (files: UploadFile[]) => void;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function CreateBanner(props: IBannerList): JSX.Element {
  const {initBanner, onRemove, onChange, isPreview} = props;
  const {t} = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [removedList, setRemovedList] = useState<number[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // file.preview = await getBase64(resizedFile as RcFile);
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({file, fileList}) => {
    if (fileList.length > 5) {
      notification.error({
        message: "Banner limit 5 images!",
      });
      setFileList(filterFileImage(fileList.splice(0, 5)));
      return;
    }
    setFileList(filterFileImage(fileList));
  };

  const handleRemove: UploadProps["onRemove"] = (file) => {
    // Remove only uploaded files
    if (!file.originFileObj) {
      setRemovedList((prevState) => [
        ...prevState,
        Number.parseInt(file.uid, 10),
      ]);
    }
  };

  function handleEditBanner(
    removedFileUid: number | string,
    file: RcFile
  ): boolean {
    if (initBanner) {
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
      // handleUpdateBanner(removedFileUid, undefined, file);
    }
    return true;
  }

  const uploadButton = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        aspectRatio: 396 / 189,
      }}
    >
      <Image
        src="/img/upload-file.svg"
        width={56}
        height={56}
        alt="logo"
        preview={false}
      />
      <div style={{marginTop: 8, color: "#a32e8c"}}>Upload Banner</div>
      <p>Recommend size: 396 x 189 pixels </p>
    </div>
  );

  useEffect(() => {
    onChange(fileList.filter((file) => file.originFileObj));
  }, [fileList]);

  useEffect(() => {
    setFileList(initBanner);
  }, [initBanner]);

  useEffect(() => {
    onRemove(removedList.length > 0 ? removedList : undefined);
  }, [removedList]);

  // Custom rendering function for each uploaded file
  const customItemRender: UploadProps["itemRender"] = (
    _originNode,
    file,
    _fileList,
    actions
  ) => (
    <div>
      <button
        type="button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        className={classNames("button-here", {
          item_last: file?.url === fileList[fileList.length - 1]?.url,
        })}
      >
        <img
          src={file.url ?? file.thumbUrl}
          className="image-banner"
          alt="logo"
        />
        <div className="action-banner">
          <button onClick={actions.preview} type="button">
            <EyeOutlined className="icon-action" />
          </button>
          <div style={{display: "flex", alignItems: "center"}}>
            <ImgCrop
              aspect={396 / 189}
              quality={0.8}
              beforeCrop={(file) => handleBeforeUploadImage(file)}
            >
              <Upload
                maxCount={1}
                accept=".jpg, .png"
                onPreview={handlePreview}
                onChange={(obj) => {
                  if (!initBanner && obj.file.status === "done") {
                    const newFileList: UploadFile[] =
                      fileList.map((f) => {
                        if (f.uid === file.uid) {
                          return obj.file;
                        }
                        return f;
                      }) ?? [];
                    setFileList(newFileList);
                  }
                }}
                showUploadList={false}
                beforeUpload={(replaceFile) =>
                  handleEditBanner(file.uid, replaceFile)
                }
              >
                <button type="button">
                  <EditOutlined className="icon-action" />
                </button>
              </Upload>
            </ImgCrop>
          </div>
          <button onClick={actions.remove} type="button">
            <DeleteOutlined className="icon-action" />
          </button>
        </div>
      </button>
    </div>
  );
  const customRequestDefault: UploadProps["customRequest"] = (options) => {
    const {file, onSuccess} = options;
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(file);
      }
    }, 1000);
  };

  return (
    <div className="banner-section-event">
      <div className="section-header">
        <h2>
          {t("partner.banner")} ({fileList.length}/5)
        </h2>
      </div>
      <Form.Item wrapperCol={{span: 24}} name="banner">
        <div className="banner-list resize-image-upload">
          <ImgCrop
            aspect={396 / 189}
            quality={0.8}
            beforeCrop={(file) => handleBeforeUploadImage(file)}
          >
            <Upload
              multiple
              maxCount={5}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              showUploadList={{showRemoveIcon: !isPreview}}
              onRemove={handleRemove}
              beforeUpload={(file) => handleBeforeUploadImage(file)}
              itemRender={customItemRender}
              accept=".jpg, .png, .jpeg"
              customRequest={customRequestDefault}
            >
              {!isPreview && fileList.length < 5 ? uploadButton : null}
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
    </div>
  );
}
