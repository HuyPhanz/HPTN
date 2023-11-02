import {Avatar, Button, Dropdown, MenuProps, Modal} from "antd";
import {
  MenuOutlined,
  UserOutlined,
  DownOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import {logoutUser} from "@app/redux/slices/UserSlice";
import {toggleMenu} from "@app/redux/slices/MenuSlice";
import {useTranslation} from "react-i18next";

/**
 *
 */
export default function Navbar(): JSX.Element {
  const user = useSelector((state: IRootState) => state.user);
  const {t} = useTranslation();

  const dispatch = useDispatch();

  // const getMeData = (): Promise<IUserLogin> => {
  //   return ApiUser.getMe();
  // };

  // const dataUser = useQuery("dataUser", getMeData);

  // useEffect(() => {
  //   dataUser.refetch().then((data) => {
  //     dispatch(loginUser({...user, user: data?.data}));
  //   });
  // }, []);

  // console.log(user);

  const handleLogout = (): void => {
    Modal.confirm({
      title: t("sidebar.logout"),
      content: t("sidebar.confirm_logout"),
      onOk: () => {
        dispatch(logoutUser());
      },
    });
  };
  /**
   *
   * @returns {*}
   */

  const items: MenuProps["items"] = [
    {
      label: (
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            console.log("routing...");
          }} // TODO
        >
          {t("sidebar.account_info")}
        </Button>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => handleLogout()}
        >
          {t("sidebar.logout")}
        </Button>
      ),
      key: "1",
    },
  ];

  return (
    <div className="navbar flex items-center justify-between">
      <div className="flex items-center">
        <MenuOutlined
          className="toggle-menu hover:opacity-70"
          onClick={(): void => {
            dispatch(toggleMenu());
          }}
        />
      </div>
      <div className="group-user-info">
        <div className="cursor-pointer flex items-center">
          <Avatar size="default" icon={<UserOutlined />} />
          <Dropdown menu={{items}} trigger={["click"]}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <a
              className="flex items-center"
              onClick={(e) => e.preventDefault()}
            >
              <span className="ml-2 hidden md:flex">
                {user.dataProfile?.email ?? `#${t("sidebar.unknown_user")}`}
              </span>
              <DownOutlined className="ml-2" />
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
