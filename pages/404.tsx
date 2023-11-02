import {Result, Button} from "antd";
import {useRouter} from "next/router";
import Config from "../config";
import {useTranslation} from "react-i18next";

export default function Custom404(): JSX.Element {
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("404.sorry")}
      extra={
        <Button
          type="primary"
          onClick={(): void => {
            router.push(Config.PATHNAME.HOME);
          }}
        >
          Back to homepage
        </Button>
      }
    />
  );
}
