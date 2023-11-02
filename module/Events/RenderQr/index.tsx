import {useRouter} from "next/router";
import QrCode from "./components/QrCode";
import "./index.scss";

export function RenderQr(): JSX.Element {
  const router = useRouter();

  return (
    <div className="render-qr">
      <div className="render-qr__background " />
      <div className="render-qr__content">
        <QrCode
          type="check-in"
          idEvent={router.query.event}
          store={router.query.store}
        />
        <QrCode
          type="purchase"
          idEvent={router.query.event}
          store={router.query.store}
        />
      </div>
    </div>
  );
}
