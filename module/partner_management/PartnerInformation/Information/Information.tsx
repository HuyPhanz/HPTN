import classNames from "classnames";
import {Form, Image, Input, Select} from "antd";
import {useTranslation} from "react-i18next";
import {getCategories} from "@app/api/ApiCategories";
import {useQuery} from "react-query";
import ApiState from "@app/api/ApiState";
import {useRouter} from "next/router";
import StringHelper from "@app/utils/helper/StringHelper";

export default function Information(props: {
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  setFieldValues: (values: {[key: string]: any}) => void;
}): JSX.Element {
  const categoryQuery = useQuery(["category-filter"], () => getCategories({}));
  const stateQuery = useQuery(["state-filter"], () =>
    ApiState.getListState({})
  );
  const router = useRouter();
  const {id} = router.query;

  const {isPreview, setPreview} = props;
  const {t} = useTranslation();

  return (
    <div className="flex info">
      <div className={classNames("info w-[100%]", {isPreview})}>
        <Form.Item
          name="name"
          label={<span className="input-title">{t("partner.name")}</span>}
          required
          rules={[
            {required: true, message: "Please enter your name!"},
            {
              min: 1,
              max: 255,
              message: " The Name contains max 255 characters",
            },
          ]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="owner"
          label={<span className="input-title">{t("partner.owner")}</span>}
          rules={[
            {
              min: 1,
              max: 255,
              message: "The Owner contains max 255 characters",
            },
          ]}
        >
          <Input placeholder="Enter owner" />
        </Form.Item>
        <Form.Item
          name="email"
          label={<span className="input-title">{t("partner.email")}</span>}
          required
          rules={[
            {required: true, message: "Please enter your email!"},

            // {
            //   pattern: /^[a-z0-9+_.-]{2,65}@/i,
            //   message: "Needs at least 2 characters before @",
            // },
            {
              pattern:
                /^([a-z0-9+_.-]{2,65})(\.[a-z0-9+_-]{2,65})*@([a-z0-9-]{2,65}\.)+[a-z]{2,6}$/i,
              message: "Invalid email!",
            },
          ]}
        >
          <Input placeholder="Enter email" disabled={id !== "new"} />
        </Form.Item>
        {isPreview ? undefined : (
          <Form.Item
            name="password"
            label={<span className="input-title">PASSWORD</span>}
            required={isPreview || id === "new"}
            rules={[
              {required: id === "new", message: "Please enter your password!"},
              {min: 6, max: 65, message: "Password length from 6 to 65!"},
              {pattern: /^[^\s]*$/, message: "Contains no spaces"},
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
        )}
        <Form.Item
          name="phone"
          label={
            <span className="input-title">{t("partner.phoneNumber")}</span>
          }
          required
          rules={[
            {required: true, message: "Please enter your phone number!"},
            {
              pattern: /^[0-9]{10,15}(?!\s).*$/,
              message:
                "The phone number must have 10 to 15 characters and no spaces are allowed",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="state_id"
          label={<span className="input-title">{t("partner.state")}</span>}
          required
          rules={[{required: true, message: "Please select your state!"}]}
        >
          <Select
            placeholder="Select state"
            showSearch
            options={
              stateQuery.data?.data?.map((state) => ({
                value: state.id,
                label: state.name,
              })) ?? []
            }
            filterOption={(input, option) => {
              return StringHelper.normalizeText(option?.label ?? "").includes(
                StringHelper.normalizeText(input)
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="category_id"
          label={<span className="input-title">{t("partner.category")}</span>}
          required
          rules={[{required: true, message: "Please select your categories!"}]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="Select categories"
            options={
              categoryQuery?.data?.data?.map((category) => ({
                value: category.id,
                label: category.name,
              })) ?? []
            }
            filterOption={(input, option) => {
              return StringHelper.normalizeText(option?.label ?? "").includes(
                StringHelper.normalizeText(input)
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label={<span className="input-title">{t("partner.address")}</span>}
          required
          rules={[
            {required: true, message: "Please enter your address!"},
            {
              min: 1,
              max: 255,
              message: "The Address contains max 255 characters",
            },
          ]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item label="Coordinates" required>
          <Form.Item
            name="lat"
            className="px-3"
            label={
              <span className="input-title normal-case">
                {t("coordinates.latitude")}
              </span>
            }
            rules={[
              {required: true, message: "Please enter latitude!"},
              {
                pattern: /^-?\d{1,3}(?:\.\d{1,15})?$/,
                message: "Invalid coordinates",
              },
              {pattern: /^[^\s]*$/, message: "Contains no spaces"},
            ]}
            labelCol={{xs: 24, md: 8, lg: 6}}
            wrapperCol={{xs: 24, lg: 18}}
          >
            <Input placeholder="Enter latitude" />
          </Form.Item>
          <Form.Item
            name="lon"
            className="m-0 px-3"
            label={
              <span className="input-title normal-case">
                {t("coordinates.longitude")}
              </span>
            }
            rules={[
              {required: true, message: "Please enter longitude!"},
              {
                pattern: /^-?\d{1,3}(?:\.\d{1,15})?$/,
                message: "Invalid coordinates",
              },
              {pattern: /^[^\s]*$/, message: "Contains no spaces"},
            ]}
            labelCol={{xs: 24, md: 8, lg: 6}}
            wrapperCol={{xs: 24, lg: 18}}
          >
            <Input placeholder="Enter longitude" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="instagram"
          label={<span className="input-title">{t("partner.instagram")}</span>}
          rules={[
            {
              min: 1,
              max: 1500,
              message: "The instagram contains max 1500 characters",
            },
          ]}
        >
          <Input placeholder="Enter link instagram" />
        </Form.Item>
        <Form.Item
          name="tiktok"
          label={<span className="input-title">{t("partner.tiktok")}</span>}
          rules={[
            {
              min: 1,
              max: 1500,
              message: "The tiktok url contains max 1500 characters",
            },
          ]}
        >
          <Input placeholder="Enter link tiktok" />
        </Form.Item>
        <Form.Item
          name="facebook"
          label={<span className="input-title">facebook</span>}
          rules={[
            {
              min: 1,
              max: 1500,
              message: "The facebook url contains max 1500 characters",
            },
          ]}
        >
          <Input placeholder="Enter link facebook" />
        </Form.Item>
        <Form.Item
          name="web"
          label={<span className="input-title">web</span>}
          rules={[
            {
              min: 1,
              max: 1500,
              message: "The web url contains max 1500 characters",
            },
          ]}
        >
          <Input placeholder="Enter link web" />
        </Form.Item>
      </div>
      {isPreview ? (
        <div>
          <Image
            width={40}
            className="hover-image"
            src="/img/icon/edit-icon.png"
            preview={false}
            onClick={() => setPreview(false)}
          />
        </div>
      ) : undefined}
    </div>
  );
}
