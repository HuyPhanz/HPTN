import {Image, Input} from "antd";
import FormItem from "antd/lib/form/FormItem";

export default function AboutUs(props: {
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
}): JSX.Element {
  const {isPreview, setPreview} = props;
  return (
    <div className="flex">
      <div className="about-us">
        <div>
          <FormItem
            className="subtitle"
            labelCol={{span: 24}}
            name="introduction_title"
            label="Brief Description in Business detail page:"
            rules={[
              {
                max: 255,
                message:
                  "The brief description in business detail page contains max 255 characters!",
              },
            ]}
          >
            <Input
              className="w-[100%] text-color"
              disabled={isPreview}
              placeholder="Enter brief description in business detail page"
            />
          </FormItem>
        </div>

        <FormItem
          name="introduction"
          labelCol={{span: 24}}
          label="Description:"
          rules={[
            {
              max: 1500,
              message: "The description contains max 1500 characters! ",
            },
          ]}
        >
          <Input.TextArea
            className="w-[100%] content-color"
            rows={14}
            disabled={isPreview}
            placeholder="Enter description"
          />
        </FormItem>
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
