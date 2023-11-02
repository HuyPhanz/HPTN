import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";
import {Modal, notification} from "antd";
import {ExportExcel} from "@app/api/ApiExport";
import moment from "moment/moment";

export interface IParamsGetCategories {
  page?: number;
  perpage?: number;
  keyword?: string;
}

export interface IResponseItemCategories {
  id: number;
  name?: string;
  description?: string;
  image_data?: number;
  created_at?: string;
  updated_at?: string;
  logo?: {
    id?: number;
    file_id?: number;
    image_data?: string;
  };
}

export interface ICategoriesResponse {
  data?: IResponseItemCategories[];
  current_page?: number;
  per_page?: number;
  total?: number;
}

export interface IPostUpdateCategory {
  name?: string;
  description?: string;
  image_data?: number;
}
export interface IGetUpdateCategoryResponse {
  name?: string;
  description?: string;
  image_data?: number | string;
  updated_at?: string;
  created_at?: string;
  id?: number;
  logo?: {
    id?: number;
    file_id?: number;
    image_data?: string;
  };
}

export interface IParamsGetIconCategory {
  keyword?: string;
}
export interface IGetListIconCategory {
  id?: number;
  file?: string;
  image_data?: string;
  key?: string;
}

export interface ICategoryIconResponse {
  data: IGetListIconCategory[];
}

function getCategories(
  param: IParamsGetCategories
): Promise<ICategoriesResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_CATEGORIES,
    method: "get",
    params: param,
  });
}

function getUpdateCategory(param: {
  id: number;
  body: IPostUpdateCategory;
}): Promise<IGetUpdateCategoryResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_CATEGORIES_UPDATE(param.id),
    method: "post",
    data: param.body,
  });
}

function getCreateCategory(
  param: IPostUpdateCategory
): Promise<IGetUpdateCategoryResponse> {
  return fetcher({
    url: Constant.API_PATH.GET_CATEGORIES_CREATE,
    method: "post",
    data: param,
  });
}
function deleteCategory(param: {
  ids: number[];
}): Promise<IGetUpdateCategoryResponse> {
  return fetcher({
    url: Constant.API_PATH.DELETE_CATEGORIES,
    method: "delete",
    params: param,
  });
}
function getListIconCategory(): Promise<IGetListIconCategory[]> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_ICON,
    method: "get",
  });
}
function handleExportCategory(
  template?: boolean,
  title = "Export Excel"
): void {
  Modal.confirm({
    title: title,
    content: template
      ? "list-categories.xlsx"
      : `categories-export-${moment().format("DDMMYYYY")}.xlsx`,
    onOk: () => {
      ExportExcel({
        method: "GET",
        url: Constant.API_PATH.GET_CATEGORIES_EXPORT,
        // params: query,
      })
        .then((res) => {
          if (!res) return;
          const outputFilename = template
            ? "list-categories.xlsx"
            : `categories-export-${moment().format("DDMMYYYY")}.xlsx`;
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
export {
  getCategories,
  getUpdateCategory,
  getCreateCategory,
  deleteCategory,
  getListIconCategory,
  handleExportCategory,
};
