import "./index.scss";
import {
  Button,
  Form,
  Image,
  Modal,
  notification,
  Spin,
  Upload,
  UploadProps,
} from "antd";
import {DatePicker, Input, Switch} from "formik-antd";
import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import BannerList from "@app/module/Events/EventsInformation/BannerList";
import CreateBanner from "module/Events/EventsInformation/BannerListCreateEvent";
import {useRouter} from "next/router";
import UploadModalBannerEvents from "@app/module/Events/EventsInformation/UploadModal";
import ApiEvent, {IEventDetailResponse} from "@app/api/ApiEvent";
import moment from "moment";
import {IAccountRole, IEventPrize} from "@app/types";
import {useMutation, useQuery} from "react-query";
import {Formik} from "formik";
import FormItem from "@app/components/FormItem";
import {UploadFile} from "antd/es/upload";
import ApiUser from "@app/api/ApiUser";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {eventFormValidation} from "@app/module/Events/EventsInformation/eventFormValidation";
import TextArea from "antd/lib/input/TextArea";
import UpdateModalBannerEvents from "@app/module/Events/EventsInformation/UpdateModal";
import ImgCrop from "antd-img-crop";
import ConfirmModal from "@app/components/ConfirmModal";
import {
  filterFileImage,
  handleBeforeUploadImage,
} from "@app/utils/helper/Upload";

export type EventValue<DateType> = DateType | null;

export type RangeValue<DateType> =
  | [EventValue<DateType>, EventValue<DateType>]
  | null;

export function EventsInformation(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  const id: string = router.query.id as string;
  const {isAdd} = router.query;
  const userRole = ApiUser.getUserRole();
  const [isPreview, setIsPreview] = useState(true);
  const [isModalBannerOpen, setIsModalBannerOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idPrizeDelete, setIdPrizeDelete] = useState(0);
  const [prizes, setPrizes] = useState<IEventPrize[]>([]);
  const [bannerList, setBannerList] = useState<UploadFile[]>([]);
  const [bannerRemove, setBannerRemove] = useState<number[] | undefined>([]);
  const [participants, setParticipants] = useState<number | undefined>(0);
  const [totalbusiness, setTotalBusiness] = useState<number | undefined>(0);
  const [logo, setLogo] = useState<UploadFile[]>([]);
  const [qrCheckin, setQrCheckin] = useState("");
  const [qrPurchased, setqrPurchased] = useState("");
  const formRef = useRef<any>(null);
  const postUpdateEventMuta = useMutation(ApiEvent.updateEvent);

  const [valuFormDetail, setValuFormDetail] = useState<any>({
    name: "",
    description: "",
    time: null,
  });
  const getDataEventDetail = (): Promise<IEventDetailResponse> =>
    ApiEvent.getEventDetail(Number(id));
  const {data: dataDetailEvent, refetch} = useQuery(
    ["dataDetail", id],
    getDataEventDetail,
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    setIsPreview(!isAdd);
  }, [isAdd]);

  useEffect(() => {
    if (dataDetailEvent) {
      setValuFormDetail({
        id: dataDetailEvent?.id,
        time: [
          moment(`${dataDetailEvent?.start_date}`),
          moment(`${dataDetailEvent?.end_date}`),
        ],
        name: dataDetailEvent?.name,
        status: dataDetailEvent?.status === 1,
        description: dataDetailEvent?.description,
      });
      setqrPurchased(
        dataDetailEvent?.purchased !== undefined
          ? dataDetailEvent?.purchased
          : ""
      );
      setQrCheckin(
        dataDetailEvent?.checkin !== undefined ? dataDetailEvent?.checkin : ""
      );
      setParticipants(dataDetailEvent?.participants_count);
      setTotalBusiness(dataDetailEvent?.business_count);
      setLogo(
        dataDetailEvent.logo
          ? [
              {
                uid: dataDetailEvent.logo,
                url: dataDetailEvent.logo,
                name: "logo",
              },
            ]
          : []
      );
      if (dataDetailEvent?.banner) {
        setBannerList(
          dataDetailEvent.banner?.map(
            (bn, index): UploadFile => ({
              uid: bn.id!.toString(),
              url: bn.image_data,
              name: `Banner ${index + 1}`,
            })
          )
        );
      }

      if (dataDetailEvent?.prizes !== undefined) {
        setPrizes(dataDetailEvent?.prizes);
      }
    }
  }, [dataDetailEvent]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleFinish = (values: {[key: string]: any}) => {
    const formData = new FormData();
    setIsLoading(true);
    Object.entries(values).forEach(([key, value]) => {
      if (key === "time" && value) {
        formData.append("start_date", moment(value[0]).format("YYYY-MM-DD"));
        formData.append("end_date", moment(value[1]).format("yyyy-MM-DD"));
      } else if (Array.isArray(value)) {
        value?.forEach((val) => {
          formData.append("banner[]", val.originFileObj);
        });
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });
    formData.append("status", values.status ? "1" : "0");
    if (bannerRemove !== undefined) {
      formData.append("banner_delete", JSON.stringify(bannerRemove));
    }
    prizes.forEach((item, index) => {
      const image = item.image !== undefined ? item.image : item.image_data;
      formData.append(
        `prizes[${index}][0]`,
        item.name !== undefined ? item.name : ""
      );
      formData.append(
        `prizes[${index}][1]`,
        item.description !== undefined ? item.description : ""
      );
      formData.append(
        `prizes[${index}][3]`,
        item.embed !== undefined ? item.embed : ""
      );
      formData.append(`prizes[${index}][2]`, image);
    });

    if (id) {
      postUpdateEventMuta.mutate(
        {id: id, data: formData},
        {
          onSuccess(data, variables, context) {
            notification.success({
              message: "Update successfully!",
            });
            refetch();
            setIsPreview(true);
            setIsLoading(false);
          },
          onError(error, variables, context) {
            notification.error({
              message: "Update failed",
            });
            setIsLoading(false);
          },
        }
      );
    } else {
      ApiEvent.createEvent(formData)
        .then(() => {
          notification.success({
            message: "Create successfully!",
          });
          router.push("/events");
          setIsLoading(false);
          setIsPreview(true);
        })
        .catch(() => {
          notification.error({
            message: "Create failed",
          });
          setIsLoading(false);
        });
    }
  };

  const showModalBanner = () => {
    setIsModalBannerOpen(true);
  };
  const handleDeletePrize = (id?: number) => {
    const updatedItems = prizes.filter((item, index) => index !== id);
    setPrizes(updatedItems);
  };

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<IEventPrize>();

  const handleViewPrize = (id: number) => {
    setPreviewOpen(!previewOpen);
    const file = prizes[id];
    setPreviewImage(file);
  };

  const [edittingIndex, setEdittingIndex] = useState<number>();
  const handleEditPrize = (index: number) => {
    setEdittingIndex(index);
    setIsModalUpdateOpen(true);
  };

  const handleUpdateNewPrize = (index: number, newPrize: IEventPrize) => {
    const newPrizes = [...prizes];
    newPrizes[index] = newPrize;
    setPrizes(newPrizes);
  };
  const uploadButton = (
    <div
      style={{display: "flex", flexDirection: "column", alignItems: "center"}}
    >
      <Image
        src="/img/upload-file.svg"
        width={120}
        height={120}
        alt="logo"
        preview={false}
        className="button-upload"
      />
      <div style={{marginTop: 8, color: "#a32e8c"}}>Upload Logo</div>
      <div style={{color: "gray"}}>418x247</div>
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

  const handleChangeLogo: UploadProps["onChange"] = ({file, fileList}) => {
    if (file.status !== "removed") {
      setLogo(filterFileImage([file]));
      formRef.current.setFieldValue("logo", file.originFileObj);
      formRef.current.setFieldValue("logo_delete", undefined);
    }
  };
  const handleRemoveLogo: UploadProps["onRemove"] = () => {
    setLogo([]);
    formRef.current.setFieldValue("logo_delete", "true");
    formRef.current.setFieldValue("logo", undefined);
  };
  return (
    <div>
      <Formik
        initialValues={valuFormDetail}
        validateOnChange
        validateOnBlur
        enableReinitialize
        onSubmit={(val) => handleFinish(val)}
        validationSchema={eventFormValidation}
        innerRef={formRef}
      >
        {({isSubmitting, handleSubmit, values, setFieldValue}): JSX.Element => (
          <div className="event-information-page">
            {isLoading && (
              <div className="absolute w-full flex items-center justify-center min-h-[70vh] loading">
                <Spin />
              </div>
            )}
            <Form layout="vertical">
              <div className="event-information-info">
                <div className="info-section">
                  <div className="event-info">
                    <div className="conner-image">
                      <Image src="/img/triangle-group.png" preview={false} />
                    </div>

                    <div className="header-event">
                      <div className="banner-wrapper">
                        {logo && isPreview ? (
                          <div className=" rounded overflow-hidden w-[23vw]">
                            <Image
                              src={
                                logo.length > 0
                                  ? logo[0]?.url
                                  : "/img/default-logo.png"
                              }
                              fallback="/img/default-logo.png"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="resize-image-upload">
                            {" "}
                            <ImgCrop
                              aspect={418 / 247}
                              quality={0.8}
                              beforeCrop={(file) =>
                                handleBeforeUploadImage(file)
                              }
                            >
                              <Upload
                                listType="picture-card"
                                accept=".jpg, .jpeg, .png"
                                maxCount={1}
                                multiple={false}
                                fileList={logo}
                                onChange={handleChangeLogo}
                                onRemove={handleRemoveLogo}
                                showUploadList={{showPreviewIcon: false}}
                                customRequest={customRequestDefault}
                                className="logo-upload"
                              >
                                {logo.length === 0 ? uploadButton : undefined}
                              </Upload>
                            </ImgCrop>
                          </div>
                        )}
                      </div>
                      <div className={classNames("info", {isPreview})}>
                        <FormItem
                          className="mb-[10px]"
                          name="name"
                          label={<span className="input-title">NAME</span>}
                          required
                        >
                          <Input.TextArea
                            name="name"
                            rows={1}
                            placeholder={t("partner.name")}
                            className="detail-data"
                            disabled={isPreview}
                          />
                        </FormItem>

                        <FormItem
                          name="time"
                          label={
                            <span className="input-title">TIME OF EVENT</span>
                          }
                          required
                          className="mb-[10px]"
                        >
                          {isPreview ? (
                            <p className="detail-data mb-[10px]">
                              {" " +
                                moment(`${dataDetailEvent?.start_date}`).format(
                                  "MM/DD/YYYY"
                                ) +
                                " - " +
                                moment(`${dataDetailEvent?.end_date}`).format(
                                  "MM/DD/YYYY"
                                )}
                            </p>
                          ) : (
                            <DatePicker.RangePicker
                              disabledDate={(current): boolean => {
                                return (
                                  current &&
                                  current <
                                    moment().subtract(1, "day").endOf("day")
                                );
                              }}
                              format="MM/DD/YYYY"
                              name="time"
                              className="w-full rounded-lg	"
                              disabled={isPreview}
                            />
                          )}
                        </FormItem>

                        <FormItem
                          name="status"
                          label={<span className="input-title">STATUS</span>}
                          className="mb-[10px]"
                        >
                          <Switch
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            name="status"
                            disabled={isPreview}
                          />
                        </FormItem>

                        {isPreview ? (
                          <div className="flex gap-2 flex-wrap justify-between">
                            <div>
                              <h3
                                style={{
                                  color: "#a3aed0",
                                  textTransform: "uppercase",
                                }}
                              >
                                TOTAL PARTICIPANTS
                              </h3>
                              <div className="participants-quantity">
                                <p className="mr-4">{participants}</p>
                                {userRole === IAccountRole.ADMIN && (
                                  <Image
                                    className="cursor-pointer hover:opacity-70"
                                    width={30}
                                    src="/img/icon/detail-participants-icon.svg"
                                    preview={false}
                                    onClick={() => {
                                      router.push(
                                        `/events/${dataDetailEvent?.id}/listParticipants`
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            <div>
                              <h3
                                style={{
                                  color: "#a3aed0",
                                  textTransform: "uppercase",
                                }}
                              >
                                business QR code
                              </h3>
                              <div className="participants-quantity">
                                <p className="mr-4">{totalbusiness}</p>
                                {userRole === IAccountRole.ADMIN && (
                                  <Image
                                    className="cursor-pointer hover:opacity-70"
                                    width={30}
                                    src="/img/icon/detail-participants-icon.svg"
                                    preview={false}
                                    onClick={() => {
                                      router.push(
                                        `/events/${dataDetailEvent?.id}/listBusiness`
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ) : undefined}
                      </div>
                      {userRole === IAccountRole.STORE ? null : (
                        <div className="edit-event">
                          {isPreview ? (
                            <Image
                              width={40}
                              className="hover-image"
                              src="/img/icon/edit-icon.png"
                              preview={false}
                              onClick={() => setIsPreview(false)}
                            />
                          ) : (
                            <Image
                              width={40}
                              className="hover-image"
                              src="/img/icon/partner-confirm-icon.png"
                              preview={false}
                              onClick={() => handleSubmit()}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="event-description">
                    <div className={classNames("info", {isPreview})}>
                      <h1
                        style={{
                          fontSize: "18px",
                          fontWeight: 500,
                          marginBottom: 5,
                        }}
                        className="required"
                      >
                        Description
                      </h1>
                      <FormItem name="description">
                        <Input.TextArea
                          className={`description-text rounded-lg ${
                            isPreview && "p-0"
                          }`}
                          name="description"
                          rows={1}
                          placeholder="Enter Description"
                          disabled={isPreview}
                        />
                      </FormItem>
                    </div>
                  </div>
                  {userRole === IAccountRole.STORE ? (
                    <div className="event-qr">
                      <div className="item-qr">
                        <h1 style={{fontSize: "24px", fontWeight: 500}}>
                          Check-in QR code
                        </h1>
                        <div className="qr">
                          <img
                            src={`data:image/png;base64,${qrCheckin}`}
                            alt="Hình ảnh"
                          />
                          <p>CODE: {dataDetailEvent?.checkin_code}</p>
                        </div>
                      </div>
                      <div className="item-qr">
                        <h1 style={{fontSize: "24px", fontWeight: 500}}>
                          Purchase QR code
                        </h1>
                        <div className="qr">
                          <img
                            src={`data:image/png;base64,${qrPurchased}`}
                            alt="Hình ảnh"
                          />
                          <p>CODE: {dataDetailEvent?.purchased_code}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                {router.pathname === "/events/new" ? (
                  <CreateBanner
                    isPreview={isPreview}
                    onChange={(files: UploadFile[]) => {
                      setFieldValue("banner", files);
                    }}
                    onRemove={(removedFiles?: number[] | undefined) => {
                      setBannerRemove(removedFiles);
                    }}
                    initBanner={bannerList}
                  />
                ) : (
                  <BannerList
                    initBanner={bannerList}
                    refetch={refetch}
                    setIsLoading={(val) => setIsLoading(val)}
                  />
                )}
              </div>
              <div className="event-prize">
                <div className="prize-header">
                  <h1>Prizes ({prizes.length}/10)</h1>
                  {userRole === IAccountRole.STORE ? null : (
                    <Button
                      disabled={prizes.length > 9}
                      onClick={showModalBanner}
                      className={
                        prizes.length > 9 ? "text-[#6A6A6A]" : "text-[#a32e8c]"
                      }
                    >
                      + Add Prizes ( max:10)
                    </Button>
                  )}
                  <UploadModalBannerEvents
                    initPrize={prizes}
                    onOk={(prize) => {
                      setPrizes((prevState) => [
                        ...prevState,
                        {
                          ...prize,
                          image_data: prize?.image_data,
                        },
                      ]);
                      if (id) {
                        handleSubmit();
                      }
                    }}
                    isModalBannerOpen={isModalBannerOpen}
                    setIsModalBannerOpen={() => setIsModalBannerOpen(false)}
                  />

                  {isModalUpdateOpen && edittingIndex !== undefined && (
                    <UpdateModalBannerEvents
                      initPrize={prizes}
                      onOk={(newPrize) => {
                        handleUpdateNewPrize(edittingIndex, newPrize);
                        if (id) {
                          handleSubmit();
                        }
                      }}
                      isModalBannerOpen={isModalUpdateOpen}
                      setIsModalBannerOpen={() => {
                        setIsModalUpdateOpen(false);
                        setEdittingIndex(undefined);
                      }}
                      indexPrize={edittingIndex!}
                    />
                  )}
                </div>
                <div className="prize-list flex grid-cols-3 overflow-x-auto overflow-y-hidden pb-3">
                  {prizes.map((prize, index) => {
                    return (
                      <div
                        key={index}
                        className="prize-item min-w-[33%] max-w-[33%]"
                      >
                        <div className="image-container">
                          <Image
                            width="100%"
                            height={149}
                            src={prize?.image_data ?? "/img/error-image.png"}
                            preview={false}
                            className="object-cover"
                          />

                          <div className="overlay">
                            <div
                              className="overlay-content"
                              role="button"
                              tabIndex={0}
                              onClick={() => handleViewPrize(index)}
                            >
                              <EyeOutlined className="cursor-pointer" />
                            </div>
                            {userRole === IAccountRole.STORE ? null : (
                              <div
                                className="overlay-content"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleEditPrize(index)}
                              >
                                <EditOutlined className="cursor-pointer" />
                              </div>
                            )}
                            {userRole === IAccountRole.STORE ? null : (
                              <div
                                className="overlay-content"
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  setIdPrizeDelete(index);
                                  setShowModalDelete(true);
                                }}
                              >
                                <DeleteOutlined className="cursor-pointer" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="prize-item-info">
                          <h1>{prize.name ?? "No data"}</h1>
                          <p>{prize.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <ConfirmModal
                  type="Delete"
                  isModalOpen={showModalDelete}
                  setIsModalOpen={(value) => setShowModalDelete(value)}
                  confirmAction={() => {
                    handleDeletePrize(idPrizeDelete);
                    setShowModalDelete(false);
                    if (id) {
                      handleSubmit();
                    }
                  }}
                />
                <Modal
                  open={previewOpen}
                  title="Prize detail"
                  footer={null}
                  width={800}
                  onCancel={() => setPreviewOpen(!previewOpen)}
                >
                  <div className="grid items-center grid-cols-2">
                    <div className="h-[230px] pr-10">
                      <img
                        alt="example"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          height: "100%",
                        }}
                        src={previewImage?.image_data}
                      />
                    </div>
                    <div className="detail-modal">
                      <div className="mb-3">
                        <p>Name:</p>
                        <Input
                          className="cursor-auto"
                          name="name-detail"
                          value={previewImage?.name}
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <p>Description:</p>
                        <TextArea
                          value={previewImage?.description}
                          rows={5}
                          style={{resize: "none"}}
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <p>Embed:</p>
                        <Input
                          name="embed-detail"
                          value={previewImage?.embed}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
