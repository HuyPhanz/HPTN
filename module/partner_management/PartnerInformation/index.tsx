import "./index.scss";
import {Form, notification, UploadFile} from "antd";
import React, {useEffect, useState} from "react";
import {useForm} from "antd/lib/form/Form";
import Banner from "@app/module/partner_management/PartnerInformation/BannerList";
import {useRouter} from "next/router";
import InfoSection from "@app/module/partner_management/PartnerInformation/Information";
import FormItem from "antd/lib/form/FormItem";
import {IPartnerForm} from "@app/types";
import {UploadProps} from "antd/es/upload";
import ApiStore, {IStoreDetailResponse} from "@app/api/ApiStore";
import {useQuery} from "react-query";
import store, {IRootState} from "@app/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import LogoSection from "@app/module/partner_management/PartnerInformation/LogoSection";

export function PartnerInformation(): JSX.Element {
  const router = useRouter();
  const id: string = router.query.id as string;
  const dispatch = useDispatch();
  const userInfo = useSelector((store: IRootState) => store?.user);
  const [isPreview, setIsPreview] = useState(true);
  const [initValues, setInitValues] = useState<IPartnerForm | undefined>();
  const [logo, setLogo] = useState<UploadFile[]>([]);
  const [bannerList, setBannerList] = useState<UploadFile[]>([]);
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
      if (id === "store") {
        const {id} = store.getState().user;
        return id
          ? ApiStore.getStoreDetail(id)
          : new Promise<IStoreDetailResponse>((resolve, reject) => {
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
            password: undefined,
            banner: undefined,
            logo: undefined,
            category_id: res.category?.map(({id}) => id) ?? [],
            state_id: Number.parseInt(res.state_id, 10),
          });
          setLogo(
            res.logo ? [{uid: res.logo, url: res.logo, name: "logo"}] : []
          );
          if (id === "store") {
            dispatch(
              loginUser({
                ...userInfo,
                avatar: res.logo,
              })
            );
          }
          setBannerList(
            res.banner?.map(
              (bn, index): UploadFile => ({
                uid: bn.id.toString(),
                url: bn.image_data,
                name: `Banner ${index + 1}`,
              })
            )
          );
        }
      },
    }
  );

  const handleFinish = (values: {[key: string]: any}) => {
    const formData = new FormData();
    setIsLoading(true);
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === "banner") {
          value?.forEach((val) => {
            formData.append(`${key}[]`, val);
          });
        } else if (key === "image_update") {
          value.forEach((val, index) => {
            formData.append(`image_update[${index}][0]`, val[0]);
            formData.append(`image_update[${index}][1]`, val[1]?.originFileObj);
          });
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else if (value) {
        formData.append(key, value);
      }
    });

    if (id) {
      if (id === "store") {
        const {user} = store.getState();
        if (user.id) {
          ApiStore.updateStore(user.id, formData)
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
      } else if (id === "new") {
        ApiStore.createStore(formData)
          .then(() => {
            notification.success({
              message: "Create successfully!",
            });
            router.back();
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      } else {
        ApiStore.updateStore(id, formData)
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

  const handleChange: UploadProps["onChange"] = ({file, fileList}) => {
    if (file.status !== "removed") {
      const isLt10M = file.size! / 1024 / 1024 < 10;
      if (!isLt10M) {
        notification.error({
          message: "Image must be smaller than 10MB!",
        });
        return;
      }
      if (
        file?.type &&
        ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
      ) {
        setLogo([file]);
        form.setFieldsValue({logo: file.originFileObj});
        form.setFieldsValue({image_delete: false});
      } else {
        notification.error({message: "Invalid file!"});
      }
    }
  };

  const handleRemove: UploadProps["onRemove"] = () => {
    setLogo([]);
    form.setFieldsValue({image_delete: true});
  };

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        ...initValues,
        logo: undefined,
        instagram: initValues.instagram,
        tiktok: initValues.tiktok,
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
          <LogoSection
            loading={isLoading || userDetailQuery.isLoading}
            isPreview={isPreview}
            logo={logo}
            initValues={initValues}
            onChange={handleChange}
            onRemove={handleRemove}
          />
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
        <div className="hidden">
          <FormItem name="logo" />
          <FormItem name="banner" />
          <FormItem name="image_delete" />
        </div>
      </Form>

      <Banner
        loading={isLoading || userDetailQuery.isLoading}
        storeId={id === "store" ? store.getState().user.id!.toString() : id}
        initBanner={id === "new" || id === undefined ? undefined : bannerList}
        onChange={(files) => {
          form.setFieldsValue({
            banner: files.map((file) => file.originFileObj),
          });
        }}
        refetch={userDetailQuery.refetch}
      />
    </div>
  );
}
