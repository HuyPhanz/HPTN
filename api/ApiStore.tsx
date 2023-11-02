import {IAccountRole, ITableResponse} from "@app/types";
import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";
import {Modal, notification, UploadFile} from "antd";
import moment from "moment/moment";
import {ExportExcel} from "@app/api/ApiExport";
import store from "@app/redux/store";

export interface IStoreTableQuery {
  status?: number;
  page: number;
  perpage: number;
  keyword?: string;
  category?: number;
}

export interface IStoreTableResponse {
  id: number;
  key?: number;
  name: string;
  logo?: string;
  state_id: number;
  email?: string;
  phone?: number;
  owner?: string;
  category: {id: number; name: string}[];
  state: {id: number; name: string};
}

export interface IStoreDetailResponse {
  id: number;
  logo: string;
  name: string;
  email: string;
  phone: string;
  lat: string;
  lon: string;
  owner: string;
  address: string;
  tiktok: string;
  instagram: string;
  introduction_title: string;
  introduction: string;
  state_id: string;
  category: {id: number; name: string}[];
  banner: {
    file_id: number;
    id: number;
    image_data: string;
  }[];
  state: {
    id: number;
    name: string;
  };
}

export interface IEventForm {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  banner?: UploadFile[];
  status?: number;
  prizes_title1?: string;
  prizes_des1?: string;
  prizes_image1?: UploadFile;
  prizes_title2?: string;
  prizes_des2?: string;
  prizes_image2?: UploadFile;
  prizes_title3?: string;
  prizes_des3?: string;
  prizes_image3?: UploadFile;
}

function getListStore(
  params?: IStoreTableQuery
): Promise<ITableResponse<IStoreTableResponse[]>> {
  if (store.getState().user.role === IAccountRole.STORE) {
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  return fetcher<ITableResponse<IStoreTableResponse[]>>({
    url: Constant.API_PATH.STORE_LIST,
    method: "get",
    params: params,
  });
}

function createStore(data: FormData): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.STORE_CREATE,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getStoreDetail(id: string | number): Promise<IStoreDetailResponse> {
  return fetcher<IStoreDetailResponse>({
    url: Constant.API_PATH.STORE_DETAIL(id),
    method: "get",
  });
}

function updateStore(id: string | number, data: FormData): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.STORE_UPDATE(id),
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function updateStoreBanner(data: FormData): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.STORE_BANNER_UPDATE,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteStore(ids: number[]): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.STORE_DELETE,
    method: "delete",
    params: {ids: ids},
  });
}

function sendMail(id: number | string): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.EMAIL_STORE(id),
    method: "post",
    params: {id: id},
  });
}

function handleImport(form: FormData): Promise<any> {
  return fetcher<any>({
    url: Constant.API_PATH.STORE_IMPORT,
    method: "post",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function handleExportExcel(template?: boolean, title = "Export Excel"): void {
  Modal.confirm({
    title: title,
    content: template
      ? "import-template.xlsx"
      : `store-export-${moment().format("DDMMYYYY")}.xlsx`,
    onOk: () => {
      ExportExcel({
        method: "GET",
        url: template
          ? Constant.API_PATH.STORE_EXPORT_TEMPLATE
          : Constant.API_PATH.STORE_EXPORT,
        // params: query,
      })
        .then((res) => {
          if (!res) return;
          const outputFilename = template
            ? "import-template.xlsx"
            : `store-export-${moment().format("DDMMYYYY")}.xlsx`;
          const url = URL.createObjectURL(new Blob([res!]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", outputFilename);
          document.body.appendChild(link);
          link.click();
          // setIsExporting(false);
          notification.success({
            message: "Export successfully!",
          });
        })
        .catch((e) => {
          // setIsExporting(false);
          notification.error({
            message: "Export failed!",
            description: e,
          });
        });
    },
    okText: "Download",
    cancelText: "Cancel",
  });
}

export default {
  getListStore,
  createStore,
  getStoreDetail,
  updateStore,
  updateStoreBanner,
  deleteStore,
  sendMail,
  handleExportExcel,
  handleImport,
};
