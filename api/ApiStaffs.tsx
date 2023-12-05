import {fetcher} from "./Fetcher";
import {IResponseDataAccounts} from "../types";
import Constant from "@app/api/Constant";

export interface IParamsGetListAccount {
  page?: number;
  search?: string;
  perpage?: number;
  role_id?: number[] | null;
}

export interface IResponseAccounts {
  current_page?: number;
  data: IResponseDataAccounts[];
  total?: number;
}

function getListAccount(
  params?: IParamsGetListAccount
): Promise<IResponseAccounts> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_STAFF,
    method: "get",
    params: params,
  });
}

function deleteStaff(param: {id: number}): Promise<IResponseAccounts> {
  return fetcher({
    url: `${Constant.API_PATH.DELETE_STAFF}/${param.id}`,
    method: "delete",
  });
}

export default {
  getListAccount,
  deleteStaff,
};
