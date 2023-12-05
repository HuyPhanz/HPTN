import "./index.scss";
import {Form, Image, notification, Spin} from "antd";
import {DatePicker, Input} from "formik-antd";
import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import ApiEvent, {IEventDetailResponse} from "@app/api/ApiEvent";
import moment from "moment";
import {IAccountRole} from "@app/types";
import {useMutation, useQuery} from "react-query";
import {Formik} from "formik";
import FormItem from "@app/components/FormItem";
import ApiUser from "@app/api/ApiUser";
import {eventFormValidation} from "@app/module/Events/EventsInformation/eventFormValidation";

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
  const formRef = useRef<any>(null);
  const postUpdateEventMuta = useMutation(ApiEvent.updateEvent);

  const [valuFormDetail, setValuFormDetail] = useState<any>({
    name: "",
    content: "",
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
        description: dataDetailEvent?.description,
        content: dataDetailEvent.content,
      });
    }
  }, [dataDetailEvent]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleFinish = (values: {[key: string]: any}) => {
    setIsLoading(true);
    values.start_date = moment(values.time[0]);
    values.end_date = moment(values.time[1]);
    delete values.time;
    if (id) {
      postUpdateEventMuta.mutate(
        {id: id, data: values},
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
      ApiEvent.createEvent(values)
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

                        {/* <FormItem */}
                        {/*  name="status" */}
                        {/*  label={<span className="input-title">STATUS</span>} */}
                        {/*  className="mb-[10px]" */}
                        {/* > */}
                        {/*  <Switch */}
                        {/*    checkedChildren="ON" */}
                        {/*    unCheckedChildren="OFF" */}
                        {/*    name="status" */}
                        {/*    disabled={isPreview} */}
                        {/*  /> */}
                        {/* </FormItem> */}

                        {isPreview ? (
                          <div className="flex gap-2 flex-wrap justify-between">
                            <div>
                              <div className="participants-quantity">
                                <p className="mr-4">Store List</p>
                                {userRole === "admin" && (
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
                        Content
                      </h1>
                      <FormItem name="content">
                        <Input.TextArea
                          className={`description-text rounded-lg ${
                            isPreview && "p-0"
                          }`}
                          name="content"
                          rows={1}
                          placeholder="Enter Content"
                          disabled={isPreview}
                        />
                      </FormItem>
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
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
