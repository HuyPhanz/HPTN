import {fetcher} from "./Fetcher";
import store, {persistor} from "../redux/store";
import {IAccountRole, IUserLogin} from "../types";
import Constant from "@app/api/Constant";
import {logoutUser} from "@app/redux/slices/UserSlice";

export interface ILoginBody {
  email: string;
  password: string;
}
export interface ILoginResponse {
  display_name?: string;
  role?: IAccountRole;
  token?: string;
  storeId?: number;
}

export interface IParamsGetUser {
  sort?: string[];
  searchFields?: string[];
  pageSize?: number;
  pageNumber?: number;
  disablePagination?: boolean;
  search?: string;
  searchType?: string;
}

export interface IChangePasswordBody {
  old_password: string;
  new_password: string;
}

function getUserAccount(params?: IParamsGetUser): Promise<IUserLogin[]> {
  return fetcher({
    url: Constant.API_PATH.USER_GET_USER_ACCOUNT,
    method: "get",
    params: params,
  });
}

function getMe(): Promise<IUserLogin> {
  return fetcher({url: Constant.API_PATH.USER_GET_ME, method: "get"});
}

function login(body: ILoginBody): Promise<ILoginResponse> {
  return fetcher(
    {url: Constant.API_PATH.USER_LOGIN, method: "post", data: body},
    {displayError: true}
  );
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function getUserRole(): IAccountRole | undefined {
  const {user} = store.getState();
  return user?.role;
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.token;
}

function getSystemInfo(): any {
  const {user} = store.getState();
  return user;
}

function getIdRoleBySlug(slug: any) {
  const positions = store.getState()?.user?.syncData?.positions;
  return positions.find((dt: any) => dt.slug === slug)?.id;
}

// function getGroupSlug() {
//   const state = store.getState();
//   const groupId = state.user?.user?.groups?.id;
//   return state.user.syncData.positions.find((gr: any) => gr?.id === groupId)
//     ?.slug;
// }

function getInfoMe() {
  return store.getState().user.user;
}
function logOut(): void {
  persistor
    .purge()
    .then(() => {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    })
    .catch(() => {
      // eslint-disable-next-line no-alert
      window.alert("Trình duyệt bị lỗi. Xóa Cookie trình duyệt và thử lại");
    });
}

function PostChangePassword(param: {
  id: number;
  body: IChangePasswordBody;
}): Promise<any> {
  return fetcher({
    url: Constant.API_PATH.USER_CHANGE_PASSWORD(param.id),
    method: "post",
    data: param.body,
  });
}

function sendVerifyCode(data: {email: string}, resend?: boolean): Promise<any> {
  return fetcher({
    url: resend
      ? Constant.API_PATH.USER_RESEND_VERIFY
      : Constant.API_PATH.USER_SEND_VERIFY_CODE,
    method: "post",
    data: data,
  });
}

function verifyCode(data: {
  email: string;
  code: number | string;
}): Promise<any> {
  return fetcher({
    url: Constant.API_PATH.USER_VERIFY,
    method: "post",
    data: data,
  });
}

function resetPassword(data: {
  email: string;
  code: number | string;
  new_password: string;
}): Promise<any> {
  return fetcher({
    url: Constant.API_PATH.USER_RESET_PASSWORD,
    method: "post",
    data: data,
  });
}

export default {
  login,
  isLogin,
  getAuthToken,
  getSystemInfo,
  getIdRoleBySlug,
  getUserRole,
  getMe,
  sendVerifyCode,
  logOut,
  getUserAccount,
  getInfoMe,
  PostChangePassword,
  verifyCode,
  resetPassword,
};
