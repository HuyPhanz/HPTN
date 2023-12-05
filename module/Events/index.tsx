import "./index.scss";

import {Image, notification, Table} from "antd";
import {ColumnsType, TablePaginationConfig} from "antd/lib/table";
import {useTranslation} from "react-i18next";
import {PlusOutlined, QrcodeOutlined} from "@ant-design/icons";
import Config from "@app/config";
import FilterGroup from "@app/components/FilterGroup";
import {useRouter} from "next/router";
import {useState} from "react";
import UploadFileModal from "@app/components/UploadFileModal";
import {ColumnFilterItem} from "antd/es/table/interface";
import ApiEvent, {
  IEventTableQuery,
  IEventTableResponse,
} from "@app/api/ApiEvent";
import {useMutation, useQuery} from "react-query";
import {IAccountRole, ITableResponse} from "@app/types";
import moment from "moment";
import ApiUser from "@app/api/ApiUser";
import {FilterValue} from "antd/lib/table/interface";
import {useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import ConfirmModal from "@app/components/ConfirmModal";

const statusFilter: ColumnFilterItem[] = [
  {
    value: 1,
    text: "Active",
  },
  {
    value: 0,
    text: "Inactive",
  },
];

export function Events(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  const userRole = ApiUser.getUserRole();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState<IEventTableQuery>({
    page: 1,
    perpage: 100,
  });
  const [checked, setChecked] = useState(true);
  const [paginationParam, setPaginationParam] = useState({
    page: 1,
    perpage: 100,
  });
  const {data, isFetching, refetch} = useQuery<
    ITableResponse<IEventTableResponse[]>
  >([query], () => ApiEvent.getListEvent(query));

  const userInfo = useSelector((store: IRootState) => store?.user);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState<number[]>([]);
  const deleteEvent = useMutation(
    (newData: number[]) => ApiEvent.deleteEvent(newData),
    {
      onSuccess: () => {
        refetch();
        setSelectedRows([]);
      },
      onError: (error) => {
        console.error("Mutation failed:", error);
      },
    }
  );
  const showConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };
  const handleChangeTable = (
    pagi: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    let sortParticipants = "";
    let sortCheckin = "";
    let sortPurchased = "";
    if (sorter?.columnKey === "sort_participants") {
      sortParticipants = sorter.order === "descend" ? "desc" : "asc";
    } else if (sorter?.columnKey === "sort_checkin") {
      sortCheckin = sorter.order === "descend" ? "desc" : "asc";
    } else if (sorter?.columnKey === "sort_purchased") {
      sortPurchased = sorter.order === "descend" ? "desc" : "asc";
    }
    if (pagi.current && pagi.pageSize) {
      setPaginationParam({
        page: pagi.current,
        perpage: pagi.pageSize,
      });
    }
    setQuery({
      ...query,
      page: pagi.current,
      perpage: pagi.pageSize,
      sort_participants: sortParticipants || undefined,
      sort_checkin: sortCheckin || undefined,
      sort_purchased: sortPurchased || undefined,
      status: (filters.status as number[]) || undefined,
    });
  };
  const handleSearch = (val: string): void => {
    setPaginationParam((prevState) => ({...prevState, page: 1}));
    setQuery((prevState) => ({...prevState, keyword: val, page: 1}));
  };

  function handleCLickEdit(id: number): void {
    router.push(`/events/${id}`);
  }

  const openPageQr = (id: number): void => {
    const idStoreString = userInfo.id ? userInfo.id.toString() : "";
    const idEventString = id ? id.toString() : "";
    const encodeIdStore = btoa(idStoreString);
    const encodedIdEvent = btoa(idEventString);
    const url = `/events/render-qr?store=${encodeIdStore}&event=${encodedIdEvent}`;
    window.open(url, "_blank");
  };

  function handleDelete(targets: number[]): void {
    deleteEvent.mutate(targets, {
      onSuccess: () => {
        notification.success({
          message: "Delete successfully!",
        });
        setIsConfirmModalOpen(false);
        refetch();
        setChecked(true);
      },
    });
  }
  const columnsStore: ColumnsType<IEventTableResponse> = [
    {
      title: t("table.index"),
      width: 50,
      align: "center",
      render: (_, __, index) => (
        <h1>
          {(paginationParam.page - 1) * paginationParam.perpage + index + 1}
        </h1>
      ),
    },
    {
      title: "Image",
      width: 104,
      dataIndex: "logo",
      render: (val) => (
        <Image
          src={val ?? "/img/error-image.png"}
          alt="logo"
          width={60}
          height={60}
          preview={false}
          fallback="/img/error-image.png"
        />
      ),
    },
    {
      title: t("partner.name"),
      width: 200,
      dataIndex: "name",
      render: (val) => val ?? "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
      render: (val) => <div className="limit-content">{val}</div> ?? "-",
    },
    {
      title: "Start date",
      width: 100,
      dataIndex: "start_date",
      render: (val) => (val ? moment(val).format("MM-DD-YYYY") : "-"),
    },
    {
      title: "End date",
      width: 100,
      dataIndex: "end_date",
      render: (val) => (val ? moment(val).format("MM-DD-YYYY") : "-"),
    },
    {
      title: "Participants",
      width: 100,
      dataIndex: "participants_count",
      key: "sort_participants",
      render: (val) => val ?? "-",
      sorter: true,
    },
    {
      title: "Check-ins",
      width: 100,
      key: "sort_checkin",
      dataIndex: "non_buy_count",
      render: (val) => val ?? "-",
      sorter: true,
    },
    {
      title: "Purchases",
      width: 100,
      key: "sort_purchased",
      dataIndex: "buy_count",
      render: (val) => val ?? "-",
      sorter: true,
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "status",
      filters: statusFilter,
      render: (val) =>
        val ? (
          <p style={{color: "#22c55e"}}>Active</p>
        ) : (
          <p style={{color: "#dc2626"}}>Inactive</p>
        ),
    },
    {
      title: "QR",
      width: 60,
      align: "center",
      fixed: "right",
      render: (val, record) => (
        <div className="flex justify-center gap-2">
          <QrcodeOutlined
            width="30"
            height="30"
            className="hover-image without"
            onClick={(): void => openPageQr(record?.id)}
          />
        </div>
      ),
    },

    {
      title: t("table.action"),
      dataIndex: "id",
      width: 60,
      align: "center",
      fixed: "right",
      render: (val, record) => (
        <div className="flex justify-center">
          <Image
            width="30"
            height="30"
            className="hover-image"
            src="/img/icon/eye.svg"
            preview={false}
            onClick={() => handleCLickEdit(record?.id)}
          />
        </div>
      ),
    },
  ];
  const columns: ColumnsType<IEventTableResponse> = [
    {
      title: t("table.index"),
      width: 50,
      align: "center",
      render: (_, __, index) => (
        <h1>
          {(paginationParam.page - 1) * paginationParam.perpage + index + 1}
        </h1>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      render: (val) => <div className="limit-content">{val}</div> ?? "-",
    },
    {
      title: "Content",
      dataIndex: "content",
      width: 300,
      render: (val) => <div className="limit-content">{val}</div> ?? "-",
    },
    {
      title: "Start date",
      dataIndex: "start_date",
      width: 100,
      render: (val) => (val ? moment(val).format("MM-DD-YYYY") : "-"),
    },
    {
      title: "End date",
      dataIndex: "end_date",
      width: 100,
      render: (val) => (val ? moment(val).format("MM-DD-YYYY") : "-"),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
      render: (val) => <div className="limit-content">{val}</div> ?? "-",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   filters: statusFilter,
    //   width: 100,
    //   render: (val) =>
    //     val ? (
    //       <p style={{color: "#22c55e"}}>Active</p>
    //     ) : (
    //       <p style={{color: "#dc2626"}}>Inactive</p>
    //     ),
    // },
    {
      title: t("table.action"),
      dataIndex: "id",
      fixed: "right",
      align: "center",
      width: 90,
      render: (val, record) => (
        <div className="flex gap-2 justify-center ">
          <Image
            width={30}
            height={30}
            className="hover-image"
            src="/img/icon/edit-icon-eye.png"
            preview={false}
            onClick={() => handleCLickEdit(record?.id)}
          />
          <Image
            width={30}
            height={30}
            className="hover-image"
            src="/img/icon/delete-icon.png"
            preview={false}
            onClick={() => {
              setIdDelete([val]);
              showConfirmModal();
            }}
          />
        </div>
      ),
    },
  ];

  const listButton = [
    {
      title: "Add Events",
      onClick: (): void => {
        router.push({
          pathname: "/events/new",
          query: {
            isAdd: true,
          },
        });
      },
      type: "add",
      startIcon: <PlusOutlined />,
    },
    {
      title: "Delete",
      onClick: () => {
        setIdDelete(selectedRows);
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
      isDisabled: checked,
    },
  ];

  return (
    <div className="content-container flex flex-col events-container">
      <UploadFileModal
        title={t("partner.import")}
        open={openModal}
        onOk={(): void => setOpenModal(false)}
        onCancel={(): void => setOpenModal(false)}
      />
      <div className="h-[50px]">
        <FilterGroup
          haveInputSearch
          placeholderSearch="Search"
          onSearch={handleSearch}
          listButton={userRole === IAccountRole.STORE ? undefined : listButton}
          titleTooltipSearch="Search by Name, Description"
        />
      </div>
      <Table
        columns={userRole === IAccountRole.STORE ? columnsStore : columns}
        dataSource={data?.data}
        rowKey="id"
        size="small"
        loading={isFetching}
        scroll={{
          x: Config.LAYOUT_CONFIG.tableWidth,
          y: Config.LAYOUT_CONFIG.tableHeight,
        }}
        onRow={(record) => ({
          onDoubleClick: () => handleCLickEdit(record?.id),
        })}
        rowSelection={
          userInfo.role === IAccountRole.STORE
            ? undefined
            : {
                type: "checkbox",
                selectedRowKeys: selectedRows,
                onChange: (keys): void => {
                  if (keys.length === 0) {
                    setChecked(true);
                  } else {
                    setChecked(false);
                  }
                  setSelectedRows(keys as number[]);
                },
              }
        }
        onChange={(pagi, filters, sorter) =>
          handleChangeTable(pagi, filters, sorter)
        }
        pagination={{
          pageSizeOptions: ["50", "100", "150"],
          showSizeChanger: true,
          total: data?.total,
          defaultPageSize: 100,
          current: paginationParam.page,
          pageSize: paginationParam.perpage,
        }}
      />
      <ConfirmModal
        type="Delete"
        isModalOpen={isConfirmModalOpen}
        setIsModalOpen={(value) => setIsConfirmModalOpen(value)}
        confirmAction={() => handleDelete(idDelete)}
        isLoading={deleteEvent.isLoading}
      />
    </div>
  );
}
