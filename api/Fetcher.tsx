import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {Modal, notification} from "antd";
import _ from "lodash";
import Config from "../config";
import store, {persistor} from "../redux/store";
import ListErrorMessage from "./ErrorMessage/ListErrorMessage";
import {loginUser, logoutUser} from "../redux/slices/UserSlice";
import {t} from "i18next";

export interface IDataError {
  errorCode: string;
  message?: string;
  status?: number;
}

export interface IMetadata {
  time?: string;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize?: number;
}

export interface IDataWithMeta<T> {
  meta: IMetadata;
  data: T;
}

export interface IResponseDTO<T> {
  status: number | boolean;
  errorCode: string;
  message?: string;
  meta?: IMetadata;
  data?: T;
}

interface IResponseWithMetadataDTO<T> {
  success: boolean;
  errorCode: string;
  message?: string;
  meta: IMetadata;
  data?: T;
}

interface IFetcherOptions {
  token?: string;
  withToken?: boolean;
  withMetadata?: boolean;
  displayError?: boolean;
}

export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
}

function logout(): void {
  persistor
    .purge()
    .then(() => {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    })
    .catch(() => {
      // eslint-disable-next-line no-alert
      window.alert(t("common.delete_cookie"));
    });
}

function confirmLogout(
  msg: string,
  cnt: string,
  isRequiredLogOut: boolean
): void {
  logout();
  Modal.destroyAll();
  if (!isRequiredLogOut) {
    Modal.confirm({
      title: msg,
      content: cnt,
      onOk: (): void => logout(),
      // onCancel: (): void => logout(),
    });
  } else {
    Modal.confirm({
      title: msg,
      content: cnt,
      onOk: (): void => logout(),
      onCancel: (): void => logout(),
    });
  }
}

function displayError(dataError: IDataError): void {
  try {
    const {errorCode} = dataError;
    let errorMessage;
    const error = ListErrorMessage.find((dt) => dt.error_code === errorCode);
    if (error) {
      errorMessage = error.description;
    } else {
      errorMessage = dataError.message ?? t("common.wrong");
    }
    notification.error({
      message: t("common.message_error"),
      description: errorMessage,
      duration: 3,
    });
  } catch (e) {
    notification.error({
      message: t("common.message_error"),
      description: _.toString(e),
      duration: 3,
    });
  }
}

function handleRefreshToken(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    fetcher<IRefreshToken>(
      {
        url: "/auth/refresh-token",
        method: "post",
        data: {refreshToken: store.getState().user?.refreshToken},
      },
      {displayError: false}
    )
      .then((res) => {
        store.dispatch(loginUser(res));
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

export async function fetcher<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {}
): Promise<T> {
  const defaultOptions: IFetcherOptions = {
    withToken: Config.NETWORK_CONFIG.USE_TOKEN,
    withMetadata: Config.NETWORK_CONFIG.WITH_METADATA,
    displayError: Config.NETWORK_CONFIG.DISPLAY_ERROR,
    ...options,
  };

  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
  });

  // Access Token
  if (defaultOptions.token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${defaultOptions.token}`;
  } else {
    if (defaultOptions.withToken) {
      const state = store.getState();
      const token = state.user?.token;
      if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
    }
  }

  return new Promise<T>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseDTO<T>>>(config)
      .then(async (response) => {
        if (response.data?.status === 200 || response.data?.status === true) {
          if (response.data.data === undefined) {
            const dataEmpty: IDataError = {
              errorCode: "ERROR???",
              message: "Data is empty",
            };
            if (defaultOptions.displayError) {
              displayError(dataEmpty);
            }
            reject(dataEmpty);
            return;
          }
          resolve(response.data.data);
          return;
        }
        const dataError: IDataError = {
          errorCode: response.data.errorCode,
          message: response.data.message,
        };
        if (dataError?.errorCode === "AUTH000221") {
          try {
            const checkRefresh = await handleRefreshToken();
            if (checkRefresh) {
              const data = await fetcher<T>(config, options);
              resolve(data);
            } else {
              confirmLogout(
                t("common.token_expired"),
                t("common.re_login"),
                false
              );
            }
            return;
          } catch (error) {
            confirmLogout(
              t("common.token_expired"),
              t("common.re_login"),
              false
            );
            return;
          }
        }
        if (dataError?.errorCode === "AUTH000220") {
          confirmLogout(t("common.token_expired"), t("common.re_login"), true);
          return;
        }
        if (
          dataError?.errorCode === "JWT000201" ||
          dataError?.errorCode === "ROLE011G"
        ) {
          confirmLogout(t("common.not_login"), t("common.no_sign_in"), false);
          return;
        }
        if (defaultOptions.displayError) {
          displayError(dataError);
        }
        reject(dataError);
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          // Axios error
          const somethingsWrong: IDataError = {
            errorCode: "ERROR???",
            message: "Somethings Wrong",
          };

          const dataError: IDataError =
            (error?.response?.data as IDataError) ?? somethingsWrong;

          if (dataError?.errorCode === "AUTH3001.NotAuthenticated") {
            persistor
              .purge()
              .then(() => {
                window.location.reload();
              })
              .catch(() => {
                // eslint-disable-next-line no-alert
                window.alert(t("common.delete_cookie"));
              });
          } else {
            if (defaultOptions.displayError) {
              if (error?.response?.status === 422 && error?.response) {
                const errList = Object.keys(error?.response?.data?.error).map(
                  (errKey) => (
                    <div key={errKey}>
                      {/* eslint-disable-next-line no-unsafe-optional-chaining */}
                      {error?.response?.data?.error[errKey][0]}
                    </div>
                  )
                );
                notification.error({
                  message: errList,
                  duration: 3,
                });
              } else {
                displayError(dataError);
              }
            }
          }
        } else {
          // Native error
          // notification.error({
          //   message: "Something is wrong. Please try again",
          //   description: _.toString(error),
          // });
        }

        return reject(error);
      });
  });
}

export async function fetcherWithMetadata<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {}
): Promise<{data: T; meta: IMetadata}> {
  const defaultOptions: IFetcherOptions = {
    withToken: Config.NETWORK_CONFIG.USE_TOKEN,
    withMetadata: true,
    displayError: Config.NETWORK_CONFIG.DISPLAY_ERROR,
    ...options,
  };

  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
  });

  // Access Token
  if (defaultOptions.withToken) {
    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  return new Promise<{data: T; meta: IMetadata}>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseWithMetadataDTO<T>>>(config)
      .then(async (response) => {
        if (response.data.success) {
          if (response.data.data === undefined) {
            const dataEmpty: IDataError = {
              errorCode: "ERROR???",
              message: "Data is empty",
            };
            if (defaultOptions.displayError) {
              displayError(dataEmpty);
            }
            reject(dataEmpty);
            return;
          }

          resolve({
            data: response.data.data,
            meta: response.data.meta,
          });
          return;
        }
        const dataError: IDataError = {
          errorCode: response.data.errorCode,
          message: response.data.message,
        };
        if (dataError?.errorCode === "AUTH000221") {
          try {
            const checkRefresh = await handleRefreshToken();
            if (checkRefresh) {
              const data = await fetcher<{data: T; meta: IMetadata}>(
                config,
                options
              );
              resolve(data);
            } else {
              // confirmLogout(
              //   "Phiên đăng nhập hết hạn",
              //   "Vui lòng đăng nhập lại!",
              //   false
              // );
            }
            return;
          } catch (error) {
            confirmLogout(
              t("common.token_expired"),
              t("common.re_login"),
              false
            );
            return;
          }
        }
        if (dataError?.errorCode === "AUTH000220") {
          confirmLogout(t("common.token_expired"), t("common.re_login"), true);
          return;
        }
        if (
          dataError?.errorCode === "JWT000201" ||
          dataError?.errorCode === "AUTH000220"
        ) {
          confirmLogout(t("common.token_expired"), t("common.re_login"), false);
          return;
        }
        if (defaultOptions.displayError) {
          displayError(dataError);
        }
        reject(dataError);
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          // Axios error
          const somethingsWrong: IDataError = {
            errorCode: "ERROR???",
            message: "Somethings Wrong",
          };

          const dataError: IDataError =
            (error?.response?.data as IDataError) ?? somethingsWrong;

          if (dataError?.errorCode === "AUTH3001.NotAuthenticated") {
            persistor
              .purge()
              .then(() => {
                window.location.reload();
              })
              .catch(() => {
                // eslint-disable-next-line no-alert
                window.alert(t("common.delete_cookie"));
              });
          } else {
            if (defaultOptions.displayError) {
              displayError(dataError);
            }
          }
        } else {
          // Native error
          // notification.error({
          //   message: "Something is wrong. Please try again",
          //   description: _.toString(error),
          //   duration: 3,
          // });
        }

        return reject(error);
      });
  });
}

export async function fetcherBlob<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {}
): Promise<T> {
  const defaultOptions: IFetcherOptions = {
    withToken: Config.NETWORK_CONFIG.USE_TOKEN,
    withMetadata: Config.NETWORK_CONFIG.WITH_METADATA,
    displayError: Config.NETWORK_CONFIG.DISPLAY_ERROR,
    ...options,
  };

  const apiClient = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
    responseType: "blob",
  });

  // Access Token
  if (defaultOptions.token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${defaultOptions.token}`;
  } else {
    if (defaultOptions.withToken) {
      const state = store.getState();
      const token = state.user?.token;
      if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
    }
  }

  return new Promise<T>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse>(config)
      .then(async (response) => {
        resolve(response.data);
      })
      .catch((error: Error | AxiosError) => {
        reject(error);
      });
  });
}
