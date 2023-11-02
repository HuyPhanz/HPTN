import {useRouter} from "next/router";
import routeList, {IRoute} from "@app/routes/RouteList";
import {useTranslation} from "react-i18next";
import {IAccountRole} from "@app/types";
import store from "@app/redux/store";

export default function ContentHeader(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();

  const asPathWithoutQuery = router.asPath.split("?")[0];
  const asPathNestedRoutes = asPathWithoutQuery
    .split("/")
    .filter((v) => v.length > 0)
    .map((path) => `/${path}`);

  function generateBreadcrumbs(): {
    path: string;
    label: string;
    icon?: JSX.Element | string;
    disabled?: boolean;
  }[] {
    if (asPathNestedRoutes.length === 0) {
      asPathNestedRoutes.push("/");
    }

    let currentRoute: IRoute | undefined = routeList.find(
      ({path}) => path === asPathNestedRoutes[0]
    );

    const crumblist: {
      path: string;
      label: string;
      icon?: JSX.Element | string;
      disabled?: boolean;
    }[] = [];
    let i = 1;
    let prePath = "";
    while (i)
      if (currentRoute) {
        const fullPath = `${prePath}${currentRoute.path}`;
        crumblist.push({
          path: fullPath,
          label: currentRoute.name,
          icon: currentRoute.icon,
          disabled: currentRoute.disabled,
        });
        prePath = fullPath;
        if (currentRoute?.children && currentRoute?.children?.length > 0) {
          currentRoute = currentRoute?.children?.find(
            // eslint-disable-next-line no-loop-func
            ({path}) => asPathNestedRoutes[i] === path
          );
        } else {
          i = 0;
        }
      } else {
        i = 0;
      }
    return crumblist;
  }

  const breadcrumbs = generateBreadcrumbs();
  const currentRoute = breadcrumbs[breadcrumbs.length - 1];
  return (
    <div className="content-header mb-3">
      <div className="flex gap-1 items-center">
        <span
          className="bg-fuchsia-500 text-white py-1 px-2 rounded mr-1"
          style={{backgroundColor: "#928BDC"}}
        >
          {breadcrumbs[0]?.icon ?? null}
        </span>
        <span>
          {breadcrumbs.length > 1 ? (
            `${breadcrumbs[0]?.label} / ${currentRoute?.label}` ? (
              <>
                {breadcrumbs[0]?.label === "Setting" ? (
                  <span>{breadcrumbs[0]?.label} /&nbsp;</span>
                ) : (
                  <span
                    role="presentation"
                    onClick={() => {
                      router.push(`${breadcrumbs[0]?.path}`);
                    }}
                    style={{cursor: "pointer"}}
                  >
                    {breadcrumbs[0]?.label} /&nbsp;
                  </span>
                )}
                <span style={{color: "#a32e8c"}}>{currentRoute?.label}</span>
              </>
            ) : (
              t("unknown.unknown_page")
            )
          ) : asPathNestedRoutes.length < 2 ? (
            <span style={{color: "#a32e8c"}}>
              {currentRoute?.label ?? t("unknown.unknown_page")}
            </span>
          ) : asPathNestedRoutes[0] === "/partners" ? (
            <div>
              {store.getState().user.role === IAccountRole.STORE ? (
                <span style={{color: "#a32e8c"}}>Detail</span>
              ) : (
                <>
                  <span
                    role="presentation"
                    onClick={() => {
                      router.push(`${breadcrumbs[0]?.path}`);
                    }}
                    style={{cursor: "pointer"}}
                  >
                    {breadcrumbs[0]?.label} /&nbsp;
                  </span>
                  <span style={{color: "#a32e8c"}}>View Business Infor</span>
                </>
              )}
            </div>
          ) : asPathNestedRoutes[0] === "/events" &&
            asPathNestedRoutes.length < 3 ? (
            <>
              <span
                role="presentation"
                onClick={() => {
                  router.push(`/${breadcrumbs[0]?.label.toLowerCase()}`);
                }}
                style={{cursor: "pointer"}}
              >
                {breadcrumbs[0]?.label} /&nbsp;
              </span>
              <span style={{color: "#a32e8c"}}>Event Detail</span>
            </>
          ) : asPathNestedRoutes[0] === "/events" &&
            asPathNestedRoutes.length > 2 ? (
            <>
              <span
                role="presentation"
                onClick={() => {
                  router.push(`/${breadcrumbs[0]?.label.toLowerCase()}`);
                }}
                style={{cursor: "pointer"}}
              >
                {breadcrumbs[0]?.label} /&nbsp;
              </span>
              <span
                role="presentation"
                onClick={() => {
                  router.push(
                    `/${breadcrumbs[0]?.label.toLowerCase()}/${
                      asPathNestedRoutes[1]
                    }`
                  );
                }}
                style={{cursor: "pointer"}}
              >
                Event Detail /&nbsp;
              </span>
              {asPathNestedRoutes[2] === "/listParticipants" ? (
                <span style={{color: "#a32e8c"}}>Participants</span>
              ) : (
                <span style={{color: "#a32e8c"}}>Business</span>
              )}
            </>
          ) : (
            t("unknown.unknown_page")
          )}
        </span>
      </div>
    </div>
  );
}
