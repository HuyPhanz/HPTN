const API_PATH = {
  /* Api system info */
  SYSTEM_REFRESH_TOKEN: "/auth/refresh-token",

  /* Api User */
  USER_LOGIN: "/auth/login",
  USER_GET_ME: "/users/me",
  USER_GET_USER_ACCOUNT: "/users/get-user",
  USER_CHANGE_PASSWORD: (id: number) =>
    `/users/change-password/${id}?_method=PUT`,
  USER_SEND_VERIFY_CODE: "/users/send-code",
  USER_RESEND_VERIFY: "/users/resend-code",
  USER_VERIFY: "/users/verify-code",
  USER_RESET_PASSWORD: "/users/reset-password",

  /* Api dashboard */
  DASHBOARD_GET_GENERAL_STATS: "/dashboard/general",
  DASHBOARD_GET_CHECKIN_STATS: "/dashboard/check-in",
  DASHBOARD_GET_TRAFFIC_STATS: "/dashboard/traffic",
  DASHBOARD_GET_PARTICIPANT_STATS: "/dashboard/participants",

  /* Api State */
  GET_LIST_STATE: "/state/list-state",
  DELETE_STATE: "/state/multiple-delete",
  POST_ADD_STATE: "/state/create",
  POST_EDIT_STATE: (id: number) => `/state/update/${id}`,

  /* Api setting */
  GET_LIST_BANNER_SETTING: "/banner/index",
  POST_CREATE_LIST_BANNER_SETTING: "/banner/create",
  POST_DELETE_LIST_BANNER_SETTING: (id: number) => `/banner/delete/${id}`,
  GET_SHOW_BANNER_SETTING: (id: number) => `/banner/show/${id}`,
  POST_EDIT_BANNER_SETTING: (id: number) => `/banner/update/${id}`,
  GET_WIN_SHOP_ABOUTUS: "/about/index",
  POST_BANNER_WIN_SHOP_ABOUTUS: "/about/create-banner",
  UPDATE_BANNER_WIN_SHOP_ABOUTUS: "/about/edit-banner",
  DELETE_BANNER_WIN_SHOP_ABOUTUS: (id: number) => `/about/delete/${id}`,
  POST_EDIT_WIN_SHOP_ABOUTUS: "/about/create-description",
  POST_EDIT_WIN_SHOP_CONTACT_US: "/about/create-contact",
  POST_EDIT_WIN_SHOP_DISTANCE: "/about/create-distance",
  GET_TERM_SERVICES: "/term-of-service/index",
  POST_TERM_SERVICES: "/term-of-service/create",
  GET_DATA_CONTACT_HELP: "/contact-us/index",
  POST_EDIT_DATA_CONTACT_HELP: "/contact-us/create",

  /* Api get Categories */
  GET_CATEGORIES: "/index-category",
  GET_CATEGORIES_CREATE: "/create-category",
  DELETE_CATEGORIES: "/delete-multiple-category",
  GET_CATEGORIES_UPDATE: (id: number) => `/update-category/${id}`,
  GET_LIST_ICON: "/example-image-category",
  GET_CATEGORIES_EXPORT: "/category/export",
  /* Api get customer */
  GET_CUSTOMER: "/users/list-user",
  POST_EDIT_CUSTOMER: "/users/edit-user",
  POST_CHANGE_STATUS_CUSTOMER: "/users/change-status",
  DELETE_CUSTOMER: "/users/delete-user",
  /* Api get Staff */
  GET_LIST_STAFF: "/staff/index",
  DELETE_STAFF: "staff/multiple-delete",

  /* Api event */
  GET_LIST_EVENT: "/index-event",
  CREATE_EVENT: "/create-event",
  DETAIL_EVENT: (id: string | number): string => `/show-event/${id}`,
  UPDATE_EVENT: (id: string | number): string => `/update-event/${id}`,
  EDIT_BANNER_EVENT: "/events/update-image",
  DELETE_EVENT: "/delete-event",
  EXPORT_EVENT: "/events/export",
  GENERATE_QR_CODE: "/generate-qrcode",
  GET_LIST_PARTICIPANTS: (id: string | number): string =>
    `/events/${id}/list-participants`,
  GET_LIST_BUSINESS_QR: (id: string | number): string =>
    `/events/list-stores/${id}`,
  /* Api store */
  STORE_LIST: "/index-store",
  STORE_CREATE: "/create-store",
  STORE_DETAIL: (id: string | number): string => `/show-store/${id}`,
  STORE_UPDATE: (id: string | number): string => `/update-store/${id}`,
  EMAIL_STORE: (id: string | number): string => `/send-account/${id}`,
  STORE_BANNER_UPDATE: "/store/update-image",
  STORE_DELETE: "/multiple-delete",
  STORE_EXPORT: "/store/export",
  STORE_IMPORT: "/store/import",
  STORE_EXPORT_TEMPLATE: "/store/download-form-excel",
};

export default {
  API_PATH,
};
