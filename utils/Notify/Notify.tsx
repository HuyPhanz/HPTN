import {notification} from "antd";

function success(message: any, description?: any) {
  notification.success({
    message,
    description,
  });
}

function error(message: any, description?: any) {
  notification.error({
    message,
    description,
  });
}

function warn(message: any, description?: any) {
  notification.warn({
    message,
    description,
  });
}

function info(message: any, description?: any) {
  notification.info({
    message,
    description,
  });
}

export default {
  info,
  warn,
  error,
  success,
};
