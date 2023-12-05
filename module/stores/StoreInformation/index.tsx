import "./index.scss";
import {Form, notification} from "antd";
import React, {useEffect, useState} from "react";
import {useForm} from "antd/lib/form/Form";
import {useRouter} from "next/router";
import InfoSection from "@app/module/stores/StoreInformation/Information";
import {IPartnerForm} from "@app/types";
import ApiStore, {IStoreDetailResponse} from "@app/api/ApiStore";
import {useQuery} from "react-query";
import moment from "moment";

export function PartnerInformation(): JSX.Element {
  const router = useRouter();
  const id: string = router.query.id as string;
  const [isPreview, setIsPreview] = useState(true);
  const [initValues, setInitValues] = useState<IPartnerForm | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = useForm();
  const userDetailQuery = useQuery(
    ["user-detail-query", id],
    () => {
      if (id === "new" || id === undefined) {
        setInitValues(undefined);
        return new Promise<IStoreDetailResponse>((resolve, reject) => {
          reject();
        });
      }
      return ApiStore.getStoreDetail(id);
    },
    {
      onSuccess: (res) => {
        if (res) {
          setInitValues({
            ...res,
          });
        }
      },
    }
  );

  const handleFinish = (values: {[key: string]: any}) => {
    setIsLoading(true);
    if (id) {
      if (id === "new") {
        ApiStore.createStore(values)
          .then(() => {
            notification.success({
              message: "Create successfully!",
            });
            router.back();
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      } else {
        ApiStore.updateStore(id, values)
          .then(() => {
            notification.success({
              message: "Update successfully!",
            });
            userDetailQuery.refetch();
            setIsPreview(true);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
    }
  };

  async function handleConfirmChange(): Promise<void> {
    await form.validateFields().catch((e) => {
      notification.error({message: "Please review your information!"});
    }); // Validate the form fields
    form.submit(); // Manually trigger the form submission, which will call handleFinish
  }

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        ...initValues,
        staff: initValues?.user?.email,
        eventName: initValues?.event?.name,
        startDate: moment(initValues?.event?.start_date).format("DD-MM-YYYY"),
        endDate: moment(initValues?.event?.end_date).format("DD-MM-YYYY"),
        content: initValues?.event?.content,
      });
      setIsPreview(true);
    } else {
      setIsPreview(false);
    }
  }, [initValues]);

  return (
    <div className="partner-information-page">
      <Form
        form={form}
        className="w-[100%]"
        layout="horizontal"
        labelCol={{xs: 24, md: 8, lg: 5}}
        wrapperCol={{xs: 20, lg: 14}}
        labelAlign="left"
        disabled={isPreview}
        onFinish={handleFinish}
      >
        <div className="info-section">
          <InfoSection
            loading={isLoading || userDetailQuery.isLoading}
            setFieldValues={(values) => form.setFieldsValue(values)}
            onOk={() => handleConfirmChange()}
            onCancel={() => {
              if (initValues) {
                form.setFieldsValue(initValues);
                userDetailQuery.refetch();
              } else {
                form.setFieldsValue(initValues);
                router.back();
              }
              setIsPreview(true);
            }}
            isPreview={isPreview}
            setPreview={(preview) => setIsPreview(preview)}
          />
        </div>
        <div className="products-section" />
      </Form>
    </div>
  );
}
