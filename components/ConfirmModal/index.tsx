import "./index.scss";

import React from "react";
import {Modal, Image, Button} from "antd";
import {IConfirmModal} from "@app/types";

function ConfirmModal(props: IConfirmModal) {
  function handleOk() {
    props.confirmAction();
  }

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  return (
    <Modal
      className="confirm-modal"
      width={350}
      open={props.isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" className="cancel-button" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="ok"
          className="confirm-button"
          onClick={() => handleOk()}
          loading={props.isLoading}
          disabled={props.isLoading}
        >
          {props.type === "Delete" ? "Delete" : "OK"}
        </Button>,
      ]}
    >
      <div className="confirm-modal-container">
        <Image
          src={
            props.type === "Delete"
              ? "/img/icon/wanna-delete.svg"
              : "/img/icon/wanna-logout.svg"
          }
          width={90}
          height={90}
          preview={false}
        />
        <p>
          {props.type === "Delete"
            ? "You wanna delete this?"
            : "You wanna Log out?"}
        </p>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
