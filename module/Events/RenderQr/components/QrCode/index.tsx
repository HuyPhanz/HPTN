import {
  DownloadOutlined,
  LoadingOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import "./index.scss";
import {useQuery} from "react-query";
import ApiEvent, {IGenerateQrcodeRes} from "@app/api/ApiEvent";
import {notification} from "antd";
import html2canvas from "html2canvas";

interface IQrCodeProps {
  type: "check-in" | "purchase" | undefined;
  idEvent?: string | string[];
  store?: string | string[];
}

function QrCode(props: IQrCodeProps): JSX.Element {
  const {type, idEvent, store} = props;

  const param = {
    event: idEvent || "",
    type: type === "check-in" ? 1 : 3,
    store: store || "",
  };

  const getDataQrCode = (): Promise<IGenerateQrcodeRes> =>
    ApiEvent.generateQrcode(param);
  const generateQrcodeQuery = useQuery(
    ["generate_qr_code", param],
    getDataQrCode,
    {
      enabled: !!idEvent && !!store && !!type,
    }
  );

  const handleDownloadQr = (): void => {
    if (!generateQrcodeQuery.data?.image) return;
    const divElement = document.createElement("div");
    divElement.className = "text-center d-none w-fit p-5";

    // Create the image element
    const imgElement = document.createElement("img");
    imgElement.src = `data:image/png;base64,${generateQrcodeQuery.data?.image}`;
    imgElement.width = 180;
    imgElement.alt = "qr-code";

    // Create the div element for the code
    const codeDiv = document.createElement("div");
    codeDiv.className = "mt-2 text-xl font-medium";
    codeDiv.textContent = `Code: ${generateQrcodeQuery.data?.code}`;

    // Append the image and code div to the main div
    divElement.appendChild(imgElement);
    divElement.appendChild(codeDiv);
    document.body.appendChild(divElement);

    html2canvas(divElement).then(function (canvas) {
      // Chuyển đổi canvas thành một URL hình ảnh
      const imgData = canvas.toDataURL("image/png");

      // Tạo một thẻ a để tải ảnh xuống
      const a = document.createElement("a");
      a.href = imgData;
      a.download = `${type ? `${type}_` : ""}qr_${
        generateQrcodeQuery.data?.code
      }.png`;
      a.click();
    });
    document.body.removeChild(divElement);
  };

  const handleShare = (): void => {
    const {href} = window.location;
    navigator.clipboard.writeText(href);
    notification.success({message: "Copied the link!", duration: 2});
  };

  return (
    <div className="qr-code-item">
      <div className="flex flex-col items-center">
        <div className="label">
          {type === "check-in" ? "Check-in QR" : "Purchase QR"}
        </div>
        <div className="content">
          <div
            className="qr"
            style={{
              backgroundImage: `url("data:image/png;base64,${generateQrcodeQuery.data?.image}")`,
            }}
          >
            {generateQrcodeQuery.isLoading && (
              <LoadingOutlined className="loadding" />
            )}
          </div>

          <div className="code">CODE: {generateQrcodeQuery.data?.code}</div>

          <div className="action-wrap">
            <button type="button" onClick={handleDownloadQr}>
              <DownloadOutlined className="icon" />
              <div className="text-xs text-slate-600">SAVE QR CODE</div>
            </button>
            <button type="button" onClick={handleShare}>
              <ShareAltOutlined className="icon" />
              <div className="text-xs text-slate-600">SHARE QR CODE</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrCode;
