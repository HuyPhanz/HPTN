/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import "./index.scss";
import {UserOutlined} from "@ant-design/icons";
import ApiUser from "@app/api/ApiUser";
import {Avatar, Button, Image} from "antd";
import React, {useState, useRef, useEffect} from "react";
import ModalChangePassword from "@app/components/Layout/InfoUser/ModalChangePassword";
import {useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import ConfirmModal from "@app/components/ConfirmModal";
import Icon from "@app/components/Icon/Icon";

function DropupButton(): JSX.Element {
  const isOpenSideBar = useSelector((state: IRootState) => state.menu.isOpen);
  const [isOpen, setIsOpen] = useState(false);
  const dropupRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useSelector((store: IRootState) => store?.user);
  const [isModalOpenLogout, setIsModalOpenLogout] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false); // Thêm state mới
  // const [hoveredChangePassword, setHoveredChangePassword] = useState(false);
  const [hoveredLogout, setHoveredLogout] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // const handleMouseOverChangePassword = () => {
  //   setHoveredChangePassword(true);
  // };
  //
  // const handleMouseOutChangePassword = () => {
  //   setHoveredChangePassword(false);
  // };

  const handleMouseOverLogout = () => {
    setHoveredLogout(true);
  };

  const handleMouseOutLogout = () => {
    setHoveredLogout(false);
  };

  const handleClickOutside = (event: any) => {
    if (dropupRef.current && !dropupRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    setIsLoadingLogout(true);
    try {
      await ApiUser.logOut();
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };
  return (
    <div className="dropup-container" ref={dropupRef}>
      <div className={`dropup-menu ${isOpen ? "slide-down" : "content"}`}>
        {/* <div */}
        {/*  onClick={showModal} */}
        {/*  className="item-Dropup" */}
        {/*  style={{justifyContent: isOpenSideBar ? "left" : "center"}} */}
        {/*  role="button" */}
        {/*  tabIndex={0} */}
        {/*  onMouseOver={handleMouseOverChangePassword} */}
        {/*  onMouseOut={handleMouseOutChangePassword} */}
        {/* > */}
        {/*  {hoveredChangePassword ? ( */}
        {/*    <Icon icon="change_password_active" size={21} /> */}
        {/*  ) : ( */}
        {/*    <Icon icon="change_password_inactive" size={21} /> */}
        {/*  )} */}

        {/*  {isOpenSideBar && ( */}
        {/*    <p className="pl-4 text-user-profile">Change Password</p> */}
        {/*  )} */}
        {/* </div> */}
        <div
          onClick={() => setIsModalOpenLogout(true)}
          className="item-Dropup"
          style={{justifyContent: isOpenSideBar ? "left" : "center"}}
          role="button"
          tabIndex={-1}
          onMouseOver={handleMouseOverLogout}
          onMouseOut={handleMouseOutLogout}
        >
          {hoveredLogout ? (
            <Icon icon="log_out_active" size={21} />
          ) : (
            <Icon icon="log_out_inactive" size={21} />
          )}
          {isOpenSideBar && <p className="pl-4 text-user-profile">Log out</p>}
        </div>
      </div>

      <Button
        onClick={toggleDropdown}
        className="flex items-center "
        style={{
          display: "flex",
          justifyContent: isOpenSideBar ? "space-between" : "center",
        }}
      >
        <div className="btn-user">
          <Avatar
            size="default"
            src={
              userInfo.avatar ? (
                <Image
                  src={userInfo.avatar}
                  alt="avatar"
                  className="object-contain"
                  preview={false}
                />
              ) : null
            }
            icon={<UserOutlined />}
            className="margin-left-4"
          />
          {isOpenSideBar && (
            <span className="user-text">{userInfo.display_name}</span>
          )}
        </div>
        {isOpenSideBar && (
          <div style={{display: "flex"}}>
            <Image
              preview={false}
              style={{display: "flex"}}
              src={isOpen ? "/img/dropdown_user.svg" : "/img/dropup_user.svg"}
            />
          </div>
        )}
      </Button>
      <ModalChangePassword
        isModalOpen={isModalOpen}
        onOK={handleOk}
        setIsModalOpen={(val) => setIsModalOpen(val)}
      />
      <ConfirmModal
        type="LogOut"
        isModalOpen={isModalOpenLogout}
        setIsModalOpen={(value) => setIsModalOpenLogout(value)}
        confirmAction={handleLogout}
        isLoading={isLoadingLogout}
      />
    </div>
  );
}

export default DropupButton;
