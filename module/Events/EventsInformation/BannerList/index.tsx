import "./index.scss";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Form, Image, Modal, notification, Upload} from "antd";
import type {RcFile, UploadProps} from "antd/es/upload";
import type {UploadFile} from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import classNames from "classnames";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {
  filterFileImage,
  handleBeforeUploadImage,
} from "@app/utils/helper/Upload";
import ApiUser from "@app/api/ApiUser";
import {IAccountRole} from "@app/types";
import {useMutation} from "react-query";
import ApiEvent from "@app/api/ApiEvent";
import ConfirmModal from "@app/components/ConfirmModal";
import {useRouter} from "next/router";

interface IBannerList {
  // onRemove: (removedFiles?: number[]) => void;
  initBanner: UploadFile[];
  // onChange: (files: UploadFile[]) => void;
  refetch: () => void;
  setIsLoading: (val: boolean) => void;
}
interface IDataEditBanner {
  image_id?: string;
  is_delete?: string;
  image_data?: Blob;
  event_id?: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function BannerList(props: IBannerList): JSX.Element {
  const {initBanner, refetch} = props;
  const {t} = useTranslation();
  const router = useRouter();
  const id: string = router.query.id as string;
  const userRole = ApiUser.getUserRole();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [removedList, setRemovedList] = useState<number[]>([]);
  const [dataEditBanner, setDataEditBanner] = useState<IDataEditBanner>({});
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isModalType, setIsModalType] = useState(true);
  const [openModalReplace, setOpenModalReplace] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUp, setFileUp] = useState<UploadFile[]>([]);
  const postEditBannerMutate = useMutation(ApiEvent.editBannerEvent);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // file.preview = await getBase64(resizedFile as RcFile);
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({file, fileList}) => {
    if (file.status === "removed") {
      setFileList(fileList);
    } else {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt10M = file.size! / 1024 / 1024 < 10;

      if (!isJpgOrPng) {
        notification.error({
          message: "You can only upload JPG/PNG/JPEG file!",
        });
        return;
      }

      if (!isLt10M) {
        notification.error({
          message: "Image must be smaller than 10MB!",
        });
        return;
      }
      if (fileList.length > 5) {
        notification.error({
          message: "Banner limit 5 images!",
        });
        setFileList(fileList.splice(0, 5));
        return;
      }

      setFileList(fileList);
    }
  };

  const handleRemove = () => {
    props.setIsLoading(true);
    const formData = new FormData();
    formData.append("image_id", dataEditBanner.image_id ?? "");
    formData.append("event_id", id.toString());
    formData.append("is_delete", "true");
    postEditBannerMutate.mutate(formData, {
      onSuccess(data) {
        refetch();
        notification.success({
          message: "Successfully delete banner!",
        });
        props.setIsLoading(false);
      },
      onError(res) {
        props.setIsLoading(false);
      },
    });
  };

  const handleChangeUpFile: UploadProps["onChange"] = ({file, fileList}) => {
    setFileUp(filterFileImage(fileList));
  };

  const uploadButton = (
    <button
      type="button"
      style={{width: "100%"}}
      onClick={(): void => {
        setOpenModalReplace(true);
      }}
    >
      <div
        className="button-here"
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
        <div style={{marginTop: 8, color: "#a32e8c"}}>
          {isModalType ? "Upload Banner" : "Replace Banner"}
        </div>
        <p>Recommend size: 396 x 189 pixels </p>
      </div>
    </button>
  );

  // useEffect(() => {
  //   onChange(fileList.filter((file) => file.originFileObj));
  // }, [fileList]);

  useEffect(() => {
    setFileList(initBanner);
  }, [initBanner]);

  // useEffect(() => {
  //   onRemove(removedList.length > 0 ? removedList : undefined);
  // }, [removedList]);

  const handleReplaceBanner = (file: any, _fileList: any) => {
    setIsModalType(false);
    setOpenModalReplace(true);
    setDataEditBanner({
      image_id: file.uid.toString(),
    });
  };

  const customItemRender: UploadProps["itemRender"] = (
    _originNode,
    file,
    _fileList,
    actions
  ) => {
    return (
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
            {userRole === IAccountRole.STORE ? null : (
              <button
                onClick={() => {
                  handleReplaceBanner(file, _fileList);
                }}
                type="button"
              >
                <EditOutlined className="icon-action" />
              </button>
            )}
            {userRole === IAccountRole.STORE ? null : (
              <button
                onClick={() => {
                  setDataEditBanner({
                    image_id: file.uid.toString(),
                    is_delete: "true",
                  });
                  setShowModalDelete(true);
                }}
                type="button"
              >
                <DeleteOutlined className="icon-action" />
              </button>
            )}
          </div>
        </button>
      </div>
    );
  };
  const handleOkeModalUpload = () => {
    if (fileUp.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("event_id", id.toString());
        fileUp.forEach((file) => {
          if (file.originFileObj) {
            formData.append("image_data", file.originFileObj);
          }
        });

        postEditBannerMutate.mutate(formData, {
          onSuccess(data) {
            refetch();
            notification.success({
              message: "Successfully add banner!",
            });
            props.setIsLoading(false);
            setOpenModalReplace(false);
            setFileUp([]);
          },
          onError(res) {
            props.setIsLoading(false);
            setOpenModalReplace(false);
            setFileUp([]);
          },
        });
      } catch (error) {
        console.error("Error adding banner:", error);
        notification.error({
          message: "Error adding banner",
          description: "An error occurred while adding the banner.",
        });
      } finally {
        setUploading(false);
        setOpenModalReplace(false);
        setFileUp([]);
      }
    }
  };

  const handleOkeModalReplace = () => {
    if (fileUp.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("event_id", id.toString());
        formData.append("image_id", dataEditBanner?.image_id ?? "");
        fileUp.forEach((file) => {
          if (file.originFileObj) {
            formData.append("image_data", file.originFileObj);
          }
        });

        postEditBannerMutate.mutate(formData, {
          onSuccess(data) {
            refetch();
            notification.success({
              message: "Successfully replace banner!",
            });
            props.setIsLoading(false);
            setOpenModalReplace(false);
            setFileUp([]);
          },
          onError(res) {
            props.setIsLoading(false);
            setOpenModalReplace(false);
            setFileUp([]);
          },
        });
      } catch (error) {
        console.error("Error replacing banner:", error);
        notification.error({
          message: "Error replacing banner",
          description: "An error occurred while replacing the banner.",
        });
      } finally {
        setUploading(false);
        setOpenModalReplace(false);
        setFileUp([]);
      }
    }
  };

  const customRequestDefault: UploadProps["customRequest"] = (options) => {
    const {file, onSuccess} = options;
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(file);
      }
    }, 500);
  };

  return (
    <div className="banner-section-event">
      <div className="section-header">
        <h2>
          {t("partner.banner")} ({fileList.length}/5)
        </h2>
      </div>
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
      <Form.Item wrapperCol={{span: 24}} name="banner">
        <div className="banner-list resize-image-upload">
          {fileList.length < 5 &&
            userRole !== IAccountRole.STORE &&
            uploadButton}
          <Upload
            multiple
            maxCount={5}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => true}
            itemRender={customItemRender}
            accept=".jpg, .png, .jpeg"
            customRequest={customRequestDefault}
          />
          <ConfirmModal
            type="Delete"
            isModalOpen={showModalDelete}
            setIsModalOpen={(value) => setShowModalDelete(value)}
            confirmAction={() => {
              handleRemove();
              setShowModalDelete(false);
            }}
            isLoading={postEditBannerMutate.isLoading}
          />
          <Modal
            title={isModalType ? "Upload Banner" : "Replace Banner"}
            open={openModalReplace}
            onOk={isModalType ? handleOkeModalUpload : handleOkeModalReplace}
            okButtonProps={{loading: uploading}}
            onCancel={(): void => {
              setOpenModalReplace(false);
              setIsModalType(true);
              setFileUp([]);
            }}
            wrapClassName="modal-upload-banner"
            width="max-content"
          >
            <ImgCrop
              aspect={396 / 189}
              quality={0.8}
              beforeCrop={(file) => handleBeforeUploadImage(file)}
            >
              <Upload
                className="upload-banner-winbig"
                multiple={false}
                accept=".jpg, .png, .jpeg"
                onPreview={handlePreview}
                listType="picture-card"
                fileList={fileUp}
                onChange={handleChangeUpFile}
                beforeUpload={(file) => handleBeforeUploadImage(file)}
                customRequest={customRequestDefault}
              >
                {fileUp.length < 1 ? uploadButton : null}
              </Upload>
            </ImgCrop>
          </Modal>
        </div>
      </Form.Item>
    </div>
  );
}
