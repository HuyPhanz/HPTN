import "./index.scss";

import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import {AccountsTable} from "module/Accounts/StaffsTable";
import {IResponseDataStaff} from "@app/types";
import FilterGroup from "@app/components/FilterGroup";
import {ModalAccounts} from "@app/module/Staffs/Modal";
import {Image, notification} from "antd";
import {useMutation, useQuery} from "react-query";
import ApiStaffs, {
  IParamsGetListStaff,
  IResponseStaff,
} from "@app/api/ApiStaffs";
import ConfirmModal from "@app/components/ConfirmModal";

export function Accounts(): JSX.Element {
  const deleteStaff = useMutation(ApiStaffs.deleteStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);
  const [selectedRows, setSelectedRows] = useState<(number | undefined)[]>([]);

  const [initialAccountModal, setInitialAccountModal] =
    useState<IResponseDataStaff>({
      id: undefined,
      email: "",
      image_data: undefined,
      password: "",
      fullname: "",
      phone: "",
      role_id: undefined,
    });
  const [paginationParam, setPaginationParam] = useState({
    current: 1,
    pageSize: 100,
  });

  const [paramListStaffs, setParamListStaffs] = useState<IParamsGetListStaff>({
    search: "",
    role_id: null,
    page: 1,
    perpage: 100,
  });

  const listStaffs = useQuery<IResponseStaff>(
    ["list-staffs", paramListStaffs],
    () => ApiStaffs.getListStaff(paramListStaffs)
  );

  const multipleDelete = () => {
    deleteStaff.mutate(
      {ids: selectedRows},
      {
        onSuccess: () => {
          notification.success({
            message: "Delete successfully!",
          });
          setIsConfirmModalOpen(false);
          setDisableDeleteButton(true);
          listStaffs.refetch();
        },
      }
    );
  };

  const listButton = [
    {
      title: "Add Staff",
      onClick: () => {
        setModalType(false);
        setInitialAccountModal({
          id: undefined,
          email: "",
          password: "",
          fullname: "",
          phone: "",
          role_id: undefined,
          image_data: undefined,
        });
        setIsModalOpen(true);
      },
      startIcon: <PlusOutlined />,
      type: "add",
    },
    {
      title: "Delete",
      onClick: () => {
        setIsConfirmModalOpen(true);
      },
      startIcon: (
        <Image
          src="/img/delete-x.svg"
          width={20}
          height={20}
          alt="delete"
          preview={false}
        />
      ),
      type: "delete",
      isDisabled: disableDeleteButton,
    },
  ];
  return (
    <div className="content-container flex flex-col">
      <div className="h-[50px]">
        <FilterGroup
          titleTooltipSearch="Search by Email, Full name"
          haveInputSearch
          placeholderSearch="Search"
          onSearch={(value: string) => {
            setParamListStaffs((prevParam) => {
              return {
                ...prevParam,
                search: value,
                page: 1,
              };
            });
            setPaginationParam((prev) => {
              return {
                ...paginationParam,
                current: 1,
              };
            });
          }}
          listButton={listButton}
        />
      </div>

      <AccountsTable
        setModal={() => setModalType(true)}
        setInitialAccountModal={(values) => {
          setInitialAccountModal(values);
        }}
        onSelectRows={(selectedRows) => setSelectedRows(selectedRows)}
        handleOpen={() => setIsModalOpen(true)}
        setDisableDeleteButton={(value) => setDisableDeleteButton(value)}
        listStaffs={listStaffs.data}
        refetch={listStaffs.refetch}
        isLoading={listStaffs.isLoading || listStaffs.isRefetching}
        paramListStaffs={paramListStaffs}
        setParamListStaffs={(value) => setParamListStaffs(value)}
        paginationParam={paginationParam}
        setPaginationParam={(value) => setPaginationParam(value)}
      />
      <ModalAccounts
        isModalOpen={isModalOpen}
        modalType={modalType}
        handleOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
        initialAccountModal={initialAccountModal}
        refetch={listStaffs.refetch}
      />
      <ConfirmModal
        type="Delete"
        isModalOpen={isConfirmModalOpen}
        setIsModalOpen={(value) => setIsConfirmModalOpen(value)}
        confirmAction={() => multipleDelete()}
        isLoading={deleteStaff.isLoading}
      />
    </div>
  );
}
