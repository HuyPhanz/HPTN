import {fetcher} from "./Fetcher";
import Constant from "@app/api/Constant";

export interface IDataListState {
  id?: number;
  name?: string;
  latitude?: string;
  longitude?: string;
  state?: string;
  key?: any;
}
export interface IParamAddState {
  name?: string;
  latitude?: string;
  longitude?: string;
  state?: string;
}
export interface IGetListState {
  current_page?: number;
  data?: IDataListState[];
  per_page?: string;
  total?: number;
}
export interface IParamRequestList {
  perpage?: number;
  search?: string;
  page?: number;
}
function postAddState(param: IParamAddState): Promise<IDataListState> {
  return fetcher({
    url: Constant.API_PATH.POST_ADD_STATE,
    method: "post",
    params: param,
  });
}
function postEditState(param: {
  id: number;
  body: IParamAddState;
}): Promise<IDataListState> {
  return fetcher({
    url: Constant.API_PATH.POST_EDIT_STATE(param.id),
    method: "post",
    params: param.body,
  });
}
function getListState(param: IParamRequestList): Promise<IGetListState> {
  return fetcher({
    url: Constant.API_PATH.GET_LIST_STATE,
    method: "get",
    params: param,
  });
}
function deleteState(param: {ids: React.Key[]}): Promise<IGetListState> {
  return fetcher({
    url: Constant.API_PATH.DELETE_STATE,
    method: "delete",
    params: param,
  });
}

export default {getListState, deleteState, postAddState, postEditState};
