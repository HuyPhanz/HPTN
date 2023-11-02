import "./index.scss";
import ImgCrop from "antd-img-crop";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {notification, Upload, Image, Spin, Modal} from "antd";
import type {RcFile, UploadProps} from "antd/es/upload";
import type {UploadFile} from "antd/es/upload/interface";
import classNames from "classnames";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import ApiStore from "@app/api/ApiStore";

interface IBannerList {
  loading: boolean;
  storeId: string;
  initBanner?: UploadFile[];
  onChange: (files: UploadFile[]) => void;
  refetch: () => void;
}

const customRequestDefault: UploadProps["customRequest"] = (options) => {
  const {file, onSuccess} = options;
  setTimeout(() => {
    if (onSuccess) {
      onSuccess(file);
    }
  }, 1000);
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function BannerList(props: IBannerList): JSX.Element {
  const {loading, initBanner, onChange, storeId, refetch} = props;
  const {t} = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["beforeUpload"] = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt10M = file.size! / 1024 / 1024 < 20;

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

  function handleUpdateBanner(
    imageId?: number | string,
    isDelete?: boolean,
    imageData?: File
  ): void {
    if (initBanner && !loading && !updateLoading) {
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("store_id", storeId);
      if (imageId) {
        formData.append("image_id", imageId.toString());
      }
      if (isDelete) {
        formData.append("is_delete", isDelete.toString());
      }
      if (imageData) {
        formData.append("image_data", imageData);
      }
      ApiStore.updateStoreBanner(formData)
        .then(() => {
          refetch();
          setUpdateLoading(false);
        })
        .catch(() => {
          setUpdateLoading(false);
        });
    }
  }

  const handleRemove: UploadProps["onRemove"] = (file: UploadFile) => {
    if (!file.originFileObj) {
      handleUpdateBanner(file.uid, true);
    }
  };

  function handleEditBanner(
    removedFileUid: number | string,
    file: RcFile
  ): boolean {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt10M = file.size! / 1024 / 1024 < 20;

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
  }

  const uploadButton = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        aspectRatio: 396 / 189,
      }}
    >
      <Image
        src="/img/upload-file.svg"
        width={56}
        height={56}
        alt="banner"
        preview={false}
      />
      <div style={{marginTop: 8, color: "#a32e8c"}}>Upload Banner</div>
      <p>Recommend size: 396 x 189 pixels </p>
    </div>
  );

  const itemRender: UploadProps["itemRender"] = (
    _originNode,
    file,
    _fileList,
    actions
  ) => (
    <button
      type="button"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
      className={classNames(`button-here button-here-hoverable`, {
        item_last: file?.url === fileList[fileList.length - 1]?.url,
      })}
    >
      <Image
        width={396}
        src={file.url ?? file.thumbUrl}
        className="object-cover"
        alt="banner"
        preview={false}
      />
      <div className="action-banner">
        <button onClick={actions.preview} type="button">
          <EyeOutlined className="icon-action" />
        </button>

        <ImgCrop
          aspect={396 / 189}
          quality={0.9}
          beforeCrop={(replaceFile) => handleEditBanner(file.uid, replaceFile)}
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
            disabled={loading || updateLoading}
            beforeUpload={(replaceFile) => {
              if (initBanner) {
                handleUpdateBanner(file.uid, undefined, replaceFile);
              }
              return true;
            }}
          >
            <button type="button">
              <EditOutlined className="icon-action" />
            </button>
          </Upload>
        </ImgCrop>

        <button
          onClick={() => {
            if (initBanner) {
              Modal.confirm({
                className: "confirm-delete",
                width: 350,
                title: "You wanna delete this?",
                closable: true,
                icon: (
                  <Image
                    src="/img/icon/wanna-delete.svg"
                    width={90}
                    height={90}
                    preview={false}
                  />
                ),
                onOk: () => {
                  actions.remove();
                },
                okText: "Delete",
                okButtonProps: {className: "okButton"},
                cancelButtonProps: {className: "cancelButton"},
              });
            } else {
              actions.remove();
            }
          }}
          type="button"
        >
          <DeleteOutlined className="icon-action" />
        </button>
      </div>
    </button>
  );

  useEffect(() => {
    if (!initBanner) {
      onChange(fileList.filter((file) => file.originFileObj));
    }
  }, [fileList]);

  useEffect(() => {
    if (initBanner) {
      setFileList(initBanner);
    }
  }, [initBanner]);

  return (
    <div className="banner-section resize-image-upload">
      {loading ? (
        <div className="flex justify-center items-center w-[100%] h-[100%]">
          <Spin />
        </div>
      ) : (
        <>
          <div className="section-header">
            <h2>
              {t("partner.banner")} ({fileList.length}/5)
            </h2>
            <span>
              <Spin spinning={updateLoading} />
            </span>
          </div>
          <div className="banner-list">
            <ImgCrop aspect={396 / 189} quality={0.9} beforeCrop={handleChange}>
              <Upload
                maxCount={5}
                accept=".jpg, .png, .jpeg"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({file, fileList}) => {
                  if (!initBanner && file.status) {
                    setFileList(fileList);
                  }
                }}
                showUploadList={{showRemoveIcon: true}}
                onRemove={handleRemove}
                customRequest={customRequestDefault}
                itemRender={itemRender}
                disabled={loading || updateLoading}
                beforeUpload={(file) => {
                  if (initBanner) {
                    handleUpdateBanner(undefined, undefined, file);
                  }
                  return true;
                }}
              >
                {fileList.length < 5 ? uploadButton : null}
              </Upload>
            </ImgCrop>

            <Image
              alt="example"
              style={{width: "100%", display: "none"}}
              src={previewImage}
              preview={{
                visible: previewOpen,
                className: "image-preview",
                src: `${previewImage}`,
                closeIcon: true,
                onVisibleChange: (value): void => {
                  setPreviewOpen(value);
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
