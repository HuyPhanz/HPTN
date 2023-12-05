import classNames from "classnames";
import {Form, Image, Input} from "antd";
import store from "@app/redux/store";

export default function Information(props: {
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  setFieldValues: (values: {[key: string]: any}) => void;
}): JSX.Element {
  // const categoryQuery = useQuery(["category-filter"], () => getCategories({}));

  const {isPreview, setPreview} = props;

  return (
    <div className="flex info">
      <div className={classNames("info w-[100%]", {isPreview})}>
        <Form.Item
          name="name"
          label={<span className="input-title">Name</span>}
          required
          rules={[{required: true, message: "Please enter store name!"}]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="address"
          label={<span className="input-title">Address</span>}
        >
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item
          name="description"
          label={<span className="input-title">Description</span>}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        {isPreview ? (
          <>
            <Form.Item
              name="staff"
              label={<span className="input-title">Staff</span>}
            >
              <Input disabled placeholder="Enter staff" />
            </Form.Item>
            <Form.Item
              name="eventName"
              label={<span className="input-title">Event Name</span>}
            >
              <Input disabled placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label={<span className="input-title">Start Date</span>}
            >
              <Input disabled placeholder="Enter date" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label={<span className="input-title">End Date</span>}
            >
              <Input disabled placeholder="Enter date" />
            </Form.Item>
            <Form.Item
              name="content"
              label={<span className="input-title">Content</span>}
            >
              <Input.TextArea disabled placeholder="Enter content" />
            </Form.Item>
          </>
        ) : undefined}
      </div>
      {isPreview && store.getState().user.role === "admin" ? (
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
