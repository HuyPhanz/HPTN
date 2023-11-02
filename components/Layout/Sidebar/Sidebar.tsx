import {Button, Menu, Image} from "antd";
import classNames from "classnames";
import {useRouter} from "next/router";
import ApiUser from "../../../api/ApiUser";
import RouteList from "../../../routes/RouteList";
import {IAccountRole} from "@app/types";
import {RightOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import {closeMenu, openMenu, toggleMenu} from "@app/redux/slices/MenuSlice";
import React from "react";
import DropupButton from "../InfoUser/MenuDropUp/MenuUser";

const RenderMenu = React.memo(() => {
  const router = useRouter();
  const userRole = ApiUser.getUserRole();
  const isOpen = useSelector((state: IRootState) => state.menu.isOpen);

  const FocusRouter = (routerFocus: string) => {
    let pathNameFocus = "";

    if (routerFocus === "/") {
      pathNameFocus = "/dashboard";
    } else if (routerFocus.split("/").length < 3) {
      pathNameFocus = routerFocus;
    } else if (
      routerFocus.split("/")[2] === "[id]" ||
      routerFocus.split("/")[2] === "new"
    ) {
      pathNameFocus = `/${routerFocus.split("/")[1]}`;
    } else pathNameFocus = routerFocus;

    return pathNameFocus;
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      defaultSelectedKeys={[router.pathname]}
      defaultOpenKeys={["/" + router.pathname.split("/")[1]]}
      selectedKeys={[FocusRouter(router.pathname)]}
    >
      {RouteList.map(({path, name, children, role, icon, isSidebar}) => {
        if (
          children &&
          children.filter(({isSidebar}) => isSidebar).length > 0
        ) {
          return (
            <Menu.SubMenu
              className={
                userRole === IAccountRole.STORE
                  ? "hide-setting-role"
                  : "sidebar-item-selection"
              }
              key={path}
              title={
                <div className="flex gap-2 align-middle">
                  <span>{icon}</span>
                  {isOpen && <span className="menu-item-title">{name}</span>}
                </div>
              }
            >
              {isOpen && (
                <Image
                  src="/img/icon/decorate-setting.svg"
                  alt="logo"
                  width={10}
                  preview={false}
                  className="decorate"
                />
              )}

              {children.map((child: any) => (
                <Menu.Item
                  key={path + child.path}
                  onClick={(): void => {
                    router.push(path + child.path);
                  }}
                  // icon={icon}
                  className="sidebar-item"
                  style={{
                    marginLeft: isOpen ? 40 : 0,
                    paddingLeft: isOpen ? 30 : 24,
                    width: isOpen ? "calc(100% - 40px)" : "100%",
                  }}
                  hidden={
                    !isSidebar ||
                    child.role?.includes(userRole ?? IAccountRole.STORE)
                  }
                >
                  <div className="flex gap-2 align-middle">
                    <span>{child.icon}</span>
                    {isOpen && (
                      <span className="menu-item-title">{child.name}</span>
                    )}
                  </div>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item
            key={path}
            className="sidebar-item"
            hidden={
              !isSidebar ||
              (role && userRole ? !role?.includes(userRole) : undefined)
            }
            onClick={(): void => {
              router.push(path);
            }}
          >
            <div className="flex gap-2 align-middle">
              <span>{icon}</span>
              <span className="menu-item-title">{name}</span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
});
RenderMenu.displayName = "RenderMenu";

/**
 *
 */
export default function Sidebar(): JSX.Element {
  const isOpen = useSelector((state: IRootState) => state.menu.isOpen);
  const dispatch = useDispatch();

  return (
    <div>
      <div className={classNames("sidebar", {open: isOpen, close: !isOpen})}>
        <Button
          className="toggle-button"
          icon={<RightOutlined />}
          size="small"
          onClick={() => dispatch(openMenu())}
        />
        <div
          className="logo-container"
          style={{justifyContent: isOpen ? "space-between" : "center"}}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => dispatch(toggleMenu())}
            className="logo-sidebar flex gap-2 items-center"
          >
            <Image
              src="/img/logo.svg"
              alt="logo"
              className="avatar"
              width={30}
              height={30}
              preview={false}
            />
            {isOpen && <h1>Win Big Shop</h1>}
          </div>
          {isOpen && (
            <Button
              size="small"
              style={{border: "unset"}}
              icon={
                <Image
                  src="/img/icon/close-sidebar-icon.svg"
                  alt="logo"
                  width={25}
                  preview={false}
                  onClick={() => dispatch(closeMenu())}
                />
              }
            />
          )}
        </div>
        <div className="render-menu">
          <RenderMenu />
        </div>
        <div
          style={{left: isOpen ? "22px" : 0, width: isOpen ? "82%" : "100%"}}
          className="info-user cursor-pointer flex items-center"
          // onClick={ApiUser.logOut}
        >
          <DropupButton />
        </div>
      </div>
    </div>
  );
}
