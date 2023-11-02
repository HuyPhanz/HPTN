import "./index.scss";
import {Image} from "antd";

export default function Banner(props: {
  src: string;
  preview?: boolean;
  fallback?: string;
  width?: string | number;
  height?: string | number;
}): JSX.Element {
  const {width, height, src, preview, fallback} = props;
  return (
    <div className="banner-wrapper">
      <Image
        width={width}
        height={height}
        src={src}
        preview={preview ?? true}
        fallback={fallback}
      />
    </div>
  );
}
