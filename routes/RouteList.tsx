import {IAccountRole} from "../types";
import IconSidebar from "@app/components/Icon/IconSidebar";

export interface IRoute {
  path: string;
  name: string;
  role?: Array<IAccountRole>;
  icon?: string | JSX.Element;
  isSidebar?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isUpdating?: boolean;
  isAuth?: boolean;
  isSSR?: boolean;
  children?: IRoute[];
  disabled?: boolean;
}

const routes: IRoute[] = [
  // {
  //   path: Config.PATHNAME.LOGIN,
  //   name: "Auth",
  //   isAuth: true,
  // },
  // {
  //   path: "/approve-news",
  //   name: "sidebar.approve_new",
  //   role: ["admin"],
  //   icon: "usd_coin_usdc",
  //   isPrivate: true,
  //   isSidebar: true,
  // },
  {
    path: "/",
    name: "Dashboard",
    icon: <IconSidebar nameIcon="dashboard" width={23} height={23} />,
    role: [IAccountRole.ADMIN, IAccountRole.STAFF],
    isSSR: true,
    isSidebar: false,
    isPrivate: true,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <IconSidebar nameIcon="dashboard" width={23} height={23} />,
    role: [IAccountRole.ADMIN, IAccountRole.STAFF],
    isSSR: true,
    isSidebar: true,
    isPrivate: true,
  },
  {
    path: "/partners",
    name: "Businesses",
    role: [IAccountRole.ADMIN, IAccountRole.STAFF],
    icon: <IconSidebar nameIcon="partners" width={23} height={23} />,
    isSidebar: true,
    isPrivate: true,
    children: [
      {
        path: "/new",
        name: "Add Business",
        role: [IAccountRole.ADMIN, IAccountRole.STAFF],
        isSidebar: false,
        isPrivate: true,
      },
    ],
  },
  {
    path: "/partners",
    name: "Detail",
    icon: <IconSidebar nameIcon="staff" width={23} height={23} />,
    role: [IAccountRole.STORE],
    isSidebar: true,
    isPrivate: true,
    children: [
      {
        path: "/store",
        name: "Detail",
        role: [IAccountRole.STORE],
        isSidebar: false,
        isPrivate: true,
      },
    ],
  },
  {
    path: "/staffs",
    name: "Win Big Team",
    icon: <IconSidebar nameIcon="staff" width={23} height={23} />,
    role: [IAccountRole.ADMIN],
    isSidebar: true,
    isPrivate: true,
  },
  {
    path: "/events",
    name: "Events",
    icon: <IconSidebar nameIcon="events" width={23} height={23} />,
    role: [IAccountRole.ADMIN, IAccountRole.STAFF, IAccountRole.STORE],
    isSidebar: true,
    isPrivate: true,
    children: [
      {
        path: "/new",
        name: "Add Events",
        role: [IAccountRole.ADMIN, IAccountRole.STAFF],
        icon: <IconSidebar nameIcon="partners" width={23} height={23} />,
        isSidebar: false,
        isPrivate: true,
      },
    ],
  },
  {
    role: [],
    path: "/events/render-qr",
    name: "Contact help",
    isSidebar: false,
    isPrivate: false,
    isPublic: true,
  },
];

export default routes;
