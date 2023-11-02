import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import RouteList, {IRoute} from "./RouteList";
import Config from "../config";
import {AppProps} from "next/app";
import {useRouter} from "next/router";
import LoginComponent from "@app/pages/login";
import ApiUser from "@app/api/ApiUser";
import {IAccountRole} from "@app/types";

export default function Routes({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element | null {
  const routerNext = useRouter();
  const userRole = ApiUser.getUserRole();

  const login = routerNext.pathname === Config.PATHNAME.LOGIN;

  const isRoute = (key: keyof IRoute): boolean => {
    for (const route of RouteList) {
      if (router.pathname === route.path) {
        return !!route[key];
      }
    }
    return false;
  };

  const isRouteRequireRole = (): boolean => {
    for (const route of RouteList) {
      if (router.pathname === route.path) {
        return !!route.role;
      }
    }
    return false;
  };

  const isUserRoleAuthorized = (): boolean => {
    const userRole = ApiUser.getUserRole();
    if (userRole) {
      for (const route of RouteList) {
        if (router.pathname === route.path) {
          return !!route.role?.includes(userRole);
        }
      }
    }
    return false;
  };

  const isPrivateRoute = (): boolean | undefined => {
    for (const route of RouteList) {
      if (router.pathname === route.path) {
        if (route.isPrivate === undefined) {
          if (ApiUser.isLogin()) {
            return route.isPrivate;
          }
          return true;
        }
        return route.isPrivate;
      }
    }
    return false;
  };

  const goToLogin = (): null => {
    router.push(Config.PATHNAME.LOGIN);
    return null;
  };

  if (typeof window === "undefined") {
    return null;
  }

  if (login) {
    return <LoginComponent />;
  }

  if (isRoute("isPublic")) {
    return <Component {...pageProps} />;
  }

  if (isRoute("isAuth")) {
    return goToLogin();
  }

  if (isPrivateRoute()) {
    if (ApiUser.isLogin()) {
      if (isRouteRequireRole()) {
        if (!isUserRoleAuthorized()) {
          if (userRole === IAccountRole.STORE) {
            router.push(Config.PATHNAME.STORE);
          } else {
            router.push(Config.PATHNAME.HOME);
          }
          return null;
        }
      }
      return (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      );
    }
    return goToLogin();
  }
  const is404Page = router.route === "/404";
  if (
    routerNext.pathname === "/events/[id]/listParticipants" &&
    (userRole === IAccountRole.STORE || userRole === IAccountRole.STAFF)
  ) {
    routerNext.push("/404");
  }
  if (!ApiUser.isLogin()) {
    if (is404Page) {
      return <Component {...pageProps} />;
    }
    return goToLogin();
  }
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}
