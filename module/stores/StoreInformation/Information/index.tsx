import "./index.scss";
import {useTranslation} from "react-i18next";
import {Button, Spin, Tabs} from "antd";
import Information from "@app/module/stores/StoreInformation/Information/Information";

export interface IPartnerInformationSection {
  loading: boolean;
  onOk: () => void;
  onCancel: () => void;
  setPreview: (preview: boolean) => void;
  isPreview: boolean;
  setFieldValues: (values: {[key: string]: any}) => void;
}

export default function InfoSection(
  props: IPartnerInformationSection
): JSX.Element {
  const {loading, isPreview, setPreview, onOk, onCancel, setFieldValues} =
    props;
  const {t} = useTranslation();

  const items = [
    {
      label: t("partner.information"),
      key: "information",
      children: (
        <Information
          isPreview={isPreview}
          setPreview={setPreview}
          setFieldValues={setFieldValues}
        />
      ),
    },
    // {
    //   label: "Products",
    //   key: "products",
    //   children: "",
    // },
  ];

  return (
    <div className="information">
      {loading ? (
        <div className="flex justify-center items-center h-[50vh] w-[100%]">
          <Spin />
        </div>
      ) : (
        <>
          <Tabs items={items} />
          {isPreview ? undefined : (
            <div className="flex gap-2 justify-end">
              <Button className="" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                className="bg-fuchsia-700 text-white rounded"
                onClick={() => onOk()}
              >
                Save
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
