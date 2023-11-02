// NAME
const STORE_NAME = "state";

// NETWORK
const NETWORK_CONFIG = {
  HOST: process.env.NEXT_PUBLIC_APP_URL,
  API_BASE_URL: process.env.NEXT_PUBLIC_APP_URL + "/api/v2",
  API_APP_URL: process.env.NEXT_PUBLIC_APP_URL + "/api",
  BASE_URL: process.env.NEXT_PUBLIC_WEB_URL,
  TIMEOUT: 30000,
  RETRY: false,
  DISPLAY_ERROR: process.env.NEXT_PUBLIC_DISPLAY_ERROR === "true",
  USE_TOKEN: true,
  WITH_METADATA: false,
};

// PATHNAME
const PATHNAME = {
  HOME: "/",
  LOGIN: "/login",
  STORE: "/partners/store",
  LANDING: "/welcome",
};

// LAYOUT
const LAYOUT_CONFIG = {
  useSidebar: true,
  useNavbar: false,
  useFooter: false,
  useBottomNavigator: false,
  tableHeight: "max(300px, calc(100vh - 222px))",
  tableWidth: 1820,
};

// LANGUAGE
const LANGUAGE = {
  DEFAULT: "en",
};

export default {
  STORE_NAME,
  NETWORK_CONFIG,
  PATHNAME,
  LAYOUT_CONFIG,
  LANGUAGE,
};
