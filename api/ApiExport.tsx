import axios from "axios";
import Config from "@app/config";
import {notification} from "antd";
import store from "@app/redux/store";
import {cloneDeep} from "lodash";

interface IExportExcel {
  method: "GET";
  url: string | undefined;
  params?: any;
}

export async function ExportExcel(config: IExportExcel) {
  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
    responseType: "arraybuffer",
  });
  const state = store.getState();
  const {token} = state.user;
  if (!token) {
    notification.error({
      message: "Login first!",
    });
    return false;
  }
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  const newConfig = cloneDeep(config);
  if (config?.params) {
    delete newConfig.params.pageNumber;
    delete newConfig.params.pageSize;
  }

  return new Promise<ArrayBuffer>((resolve, rej) => {
    apiClient.request(newConfig).then(async (res) => {
      const isArrayBuffer = res.data instanceof ArrayBuffer;
      if (!isArrayBuffer) {
        rej(res.data.error);
        return;
      }
      resolve(res.data);
    });
  });
}
