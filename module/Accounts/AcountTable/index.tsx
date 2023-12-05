import "./index.scss";
import {Space, Table, Image, notification, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";
import {useTranslation} from "react-i18next";
import {IResponseDataAccounts} from "@app/types";
import Config from "@app/config";
import ApiStaffs, {
  IParamsGetListAccount,
  IResponseAccounts,
} from "@app/api/ApiStaffs";
import {useState} from "react";
import ConfirmModal from "@app/components/ConfirmModal";
import {useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import {useMutation} from "react-query";

interface IAccountTableProps {
  // onSelectRows: (selectedRows: (number | undefined)[]) => void;
  handleOpen: () => void;
  setModal: () => void;
  setInitialAccountModal: (value: IResponseDataAccounts) => void;
  // setDisableDeleteButton: (value: boolean) => void;
  listStaffs: IResponseAccounts | undefined;
  paramListStaffs: IParamsGetListAccount;
  setParamListStaffs: (value: IParamsGetListAccount) => void;
  paginationParam: {current: number; pageSize: number};
  setPaginationParam: (value: any) => void;
  refetch: () => void;
  isLoading: boolean;
}

export function AccountsTable(props: IAccountTableProps): JSX.Element {
  const {t} = useTranslation();
  const userId = useSelector((store: IRootState) => store?.user.id);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);

  const showConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const dataTable = props.listStaffs?.data?.map((item: any) => ({
    ...item,
    key: item.id,
  }));

  const deleteStaff = useMutation(ApiStaffs.deleteStaff);

  function handleEditAccount(record: IResponseDataAccounts) {
    props.setModal();
    props.setInitialAccountModal(record);
    props.handleOpen();
  }

  // const rowSelection = {
  //   onChange: (
  //     selectedRowKeys: React.Key[],
  //     selectedRows: IResponseDataStaff[]
  //   ) => {
  //     if (selectedRowKeys.length === 0) {
  //       props.setDisableDeleteButton(true);
  //     } else {
  //       props.setDisableDeleteButton(false);
  //     }
  //     props.onSelectRows(selectedRows.map((staff) => staff.id));
  //   },
  //   getCheckboxProps: (record: IResponseDataStaff) => ({
  //     disabled: record.id === userId, // Column configuration not to be checked
  //     name: record.fullname,
  //   }),
  // };

  const handleDelete = (id: number) => {
    deleteStaff.mutate(
      {id},
      {
        onSuccess: () => {
          notification.success({
            message: "Delete successfully!",
          });
          setIsConfirmModalOpen(false);
          props.refetch();
        },
      }
    );
  };

  const columns: ColumnsType<IResponseDataAccounts> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (_, record, index) => (
        <h1>
          {(props.paginationParam.current - 1) *
            props.paginationParam.pageSize +
            index +
            1}
        </h1>
      ),
    },
    // {
    //   title: t("account_table.avatar"),
    //   dataIndex: "avatar",
    //   key: "avatar",
    //   width: "10%",
    //   render: (_, record) => (
    //     <Image
    //       src={record?.avatar ? record?.avatar : "/img/avatar/avatar.jpg"}
    //       alt=""
    //       width={60}
    //       height={60}
    //       preview={false}
    //       fallback="/img/avatar/avatar.jpg"
    //     />
    //   ),
    // },
    // {
    //   title: t("account_table.full_name"),
    //   dataIndex: "fullname",
    //   key: "fullname",
    //   width: "20%",
    // },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: t("account_table.phone_number"),
    //   dataIndex: "phone",
    //   key: "phone",
    //   width: "20%",
    // },
    {
      title: t("Role"),
      key: "role_id",
      dataIndex: "role",
      filters: [
        {
          text: "Admin",
          value: "admin",
        },
        {
          text: "Staff",
          value: "staff",
        },
      ],
      render: (val) => <h1 className="capitalize">{val}</h1>,
    },

    {
      title: t("Store"),
      dataIndex: ["store", "name"],
      key: "store",
    },
    {
      title: t("account_table.actions"),
      // align: "left",
      key: "action",
      dataIndex: "id",
      fixed: "right",
      width: "10%",
      render: (val, record) => (
        <Space size="middle">
          <Image
            src="/img/Edit-item-table.svg"
            width={30}
            height={30}
            alt="logo"
            onClick={() => handleEditAccount(record)}
            preview={false}
            style={{cursor: "pointer"}}
          />
          {val !== userId ? (
            <Image
              src="/img/Delete-item-table.svg"
              width={30}
              height={30}
              alt="logo"
              onClick={() => {
                setIdDelete(val);
                showConfirmModal();
              }}
              preview={false}
              style={{cursor: "pointer"}}
            />
          ) : (
            <Tag color="green">You</Tag>
          )}
        </Space>
      ),
    },
  ];

  const pagination = {
    current: props.paginationParam.current,
    pageSizeOptions: ["50", "100", "150"],
    pageSize: props.paginationParam.pageSize,
    showSizeChanger: true,
    showQuickJumper: false,
    total: props.listStaffs?.total,
  };

  return (
    <>
      <Table
        className="accounts-content"
        columns={columns}
        dataSource={dataTable}
        pagination={pagination}
        loading={props.isLoading}
        size="small"
        scroll={{
          // x: Config.LAYOUT_CONFIG.tableWidth - 1600,
          x: 1000,
          y: Config.LAYOUT_CONFIG.tableHeight,
        }}
        onChange={(pagination, filters) => {
          if (pagination.current && pagination.pageSize) {
            props.setPaginationParam({
              current: pagination.current,
              pageSize: pagination.pageSize,
            });
          }
          props.setParamListStaffs({
            ...props.paramListStaffs,
            page: pagination.current,
            perpage: pagination.pageSize,
            role_id: filters.role_id ? (filters.role_id as number[]) : null,
          });
        }}
      />
      <ConfirmModal
        type="Delete"
        isModalOpen={isConfirmModalOpen}
        setIsModalOpen={(value) => setIsConfirmModalOpen(value)}
        confirmAction={() => handleDelete(idDelete)}
        isLoading={deleteStaff.isLoading}
      />
    </>
  );
}
