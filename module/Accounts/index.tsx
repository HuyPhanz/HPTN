import "./index.scss";

import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import {AccountsTable} from "module/Accounts/AcountTable";
import {IResponseDataAccounts} from "@app/types";
import FilterGroup from "@app/components/FilterGroup";
import {ModalAccounts} from "@app/module/Accounts/Modal";
import {useQuery} from "react-query";
import ApiStaffs, {
  IParamsGetListAccount,
  IResponseAccounts,
} from "@app/api/ApiStaffs";
// import ConfirmModal from "@app/components/ConfirmModal";

export function Accounts(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(false);

  const [initialAccountModal, setInitialAccountModal] =
    useState<IResponseDataAccounts>({
      id: undefined,
      email: "",
      password: undefined,
      role: undefined,
      store: undefined,
      profile: undefined,
    });
  const [paginationParam, setPaginationParam] = useState({
    current: 1,
    pageSize: 100,
  });

  const [paramListAccounts, setParamListAccounts] =
    useState<IParamsGetListAccount>({
      // search: "",
      // role: null,
      page: 1,
      perpage: 100,
    });

  const listAccounts = useQuery<IResponseAccounts>(
    ["list-account", paramListAccounts],
    () => ApiStaffs.getListAccount(paramListAccounts)
  );
  console.log("listAccount: ", listAccounts);
  // const multipleDelete = () => {
  //   deleteStaff.mutate(
  //     {id: selectedRows},
  //     {
  //       onSuccess: () => {
  //         notification.success({
  //           message: "Delete successfully!",
  //         });
  //         setIsConfirmModalOpen(false);
  //         // setDisableDeleteButton(true);
  //         listAccounts.refetch();
  //       },
  //     }
  //   );
  // };

  const listButton = [
    {
      title: "Add Account",
      onClick: () => {
        setModalType(false);
        setInitialAccountModal({
          id: undefined,
          email: "",
          password: "",
          role: undefined,
          store: undefined,
          profile: undefined,
        });
        setIsModalOpen(true);
      },
      startIcon: <PlusOutlined />,
      type: "add",
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
            setParamListAccounts((prevParam: any) => {
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
        // onSelectRows={(selectedRows) => setSelectedRows(selectedRows)}
        handleOpen={() => setIsModalOpen(true)}
        // setDisableDeleteButton={(value) => setDisableDeleteButton(value)}
        listStaffs={listAccounts.data}
        refetch={listAccounts.refetch}
        isLoading={listAccounts.isLoading || listAccounts.isRefetching}
        paramListStaffs={paramListAccounts}
        setParamListStaffs={(value) => setParamListAccounts(value)}
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
        refetch={listAccounts.refetch}
      />
    </div>
  );
}
