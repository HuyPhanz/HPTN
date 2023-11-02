import {fetcher} from "./Fetcher";
import {IResponseDataStaff} from "../types";
import Constant from "@app/api/Constant";

export interface IParamsGetListStaff {
  page?: number;
  search?: string;
  perpage?: number;
  role_id?: number[] | null;
}

export interface IResponseStaff {
  current_page?: number;
  data: IResponseDataStaff[];
  total?: number;
}

function getListStaff(params?: IParamsGetListStaff): Promise<IResponseStaff> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_STAFF,
    method: "get",
    params: params,
  });
}

function deleteStaff(param: {
  ids: (number | undefined)[];
}): Promise<IResponseStaff> {
  return fetcher({
    url: Constant.API_PATH.DELETE_STAFF,
    method: "delete",
    params: param,
  });
}

export default {
  getListStaff,
  deleteStaff,
};
