import {notification} from "antd";
import {RcFile} from "antd/lib/upload";

export const handleBeforeUploadImage = (file: RcFile, size = 10): boolean => {
  const fileSize = file.size ?? 0;
  const maxSize = size * 1024 * 1024;
  const typeImage = ["image/png", "image/jpg", "image/jpeg"];
  if (!typeImage.includes(file?.type)) {
    notification.error({
      message: `The image is not available!`,
      description: `Images must be in ${typeImage.map(
        (fo) => fo.split("/")[1]
      )} format`,
    });
    return false;
  }
  if (fileSize > maxSize) {
    notification.error({
      message: `file size does not exceed ${size} MB`,
    });
    return false;
  }
  return true;
};

export const filterFileImage = (fileList: any[], size = 10) => {
  const maxSize = size * 1024 * 1024;
  const typeImage = ["image/png", "image/jpg", "image/jpeg"];
  return fileList.filter(
    (file) => file?.size <= maxSize && typeImage.includes(file?.type)
  );
};
