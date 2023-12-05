import "./index.scss";
import {Image, notification, Pagination, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {useTranslation} from "react-i18next";
import {PlusOutlined} from "@ant-design/icons";
import Config from "@app/config";
import FilterGroup from "@app/components/FilterGroup";
import {useRouter} from "next/router";
import React, {Key, useState} from "react";
import {useQuery} from "react-query";
import ApiStore, {
  IStoreTableQuery,
  IStoreTableResponse,
} from "@app/api/ApiStore";
import addKeys from "@app/utils/convert/AddKeys";
import ConfirmModal from "@app/components/ConfirmModal";
import store from "@app/redux/store";
import {IAccountRole} from "@app/types";

export function PartnerManagement(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  if (store.getState().user.role === IAccountRole.STORE) {
    router.push("/partners/store");
  }
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const [query, setQuery] = useState<IStoreTableQuery>({page: 1, perpage: 100});
  const [totalData, setTotalData] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTypeDel, setIsTypeDel] = useState<"one" | "multi">("multi");
  const [idDelOne, setIdDelOne] = useState<Key[]>([]);

  const storeQuery = useQuery(
    ["store-query", query],
    () => ApiStore.getListStore(query),
    {
      onSuccess: (res) => {
        setTotalData(res.total);
      },
    }
  );

  // const categoryQuery = useQuery(["category-filter"], () => getCategories({}));

  const handleSearch = (val: string) => {
    setQuery((prevState) => ({
      ...prevState,
      keyword: val,
      page: 1,
    }));
  };

  function handleCLickEdit(id: number | string): void {
    router.push(`/partners/${id}`);
  }

  function handleCLickDelete(): void {
    const idsDel = isTypeDel === "multi" ? selectedRows : idDelOne;
    ApiStore.deleteStore(idsDel as number[]).then(() => {
      if (isTypeDel === "multi") {
        setSelectedRows([]);
      } else {
        setIdDelOne([]);
      }
      setIsConfirmModalOpen(false);
      setIsTypeDel("multi");
      notification.success({message: "Delete successfully!"});
      storeQuery.refetch();
    });
  }

  const columns: ColumnsType<IStoreTableResponse> = [
    {
      title: t("table.index"),
      width: 20,
      render: (_val, _record, index) =>
        (query.page - 1) * query.perpage + index + 1,
    },
    {
      title: t("Name"),
      width: 60,
      dataIndex: "name",
      render: (val) => val ?? "-",
    },
    {
      title: t("Staff"),
      width: 30,
      dataIndex: ["user", "name"],
      render: (val) => val ?? "-",
    },
    // {
    //   title: t("Category"),
    //   key: "category",
    //   width: 30,
    //   dataIndex: ["category", "name"],
    //   // filters:
    //   //   categoryQuery.data?.data?.map((ca) => ({
    //   //     value: ca.id,
    //   //     text: ca.name,
    //   //   })) ?? [],
    //   // filterSearch: true,
    //   render: (val) => val ?? "-",
    // },
    {
      title: t("Address"),
      width: 60,
      dataIndex: "address",
      render: (val) => val ?? "-",
    },
    {
      title: t("table.action"),
      dataIndex: "id",
      align: "center",
      width: 30,
      // fixed: "right",
      render: (val, record) => (
        <div className="flex gap-4 justify-center">
          <Image
            width={30}
            height={30}
            className="hover-image"
            src="/img/icon/edit-icon-eye.png"
            preview={false}
            onClick={() => handleCLickEdit(val)}
          />
          <Image
            width={30}
            height={30}
            className="hover-image"
            src="/img/icon/delete-icon.png"
            preview={false}
            onClick={(): void => {
              setIsTypeDel("one");
              setIdDelOne([val]);
              setIsConfirmModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const listButton = [
    {
      title: "Add Store",
      startIcon: <PlusOutlined />,
      onClick: () => {
        router.push("/partners/new");
      },
      type: "add",
    },
    {
      title: "Delete",
      startIcon: (
        <Image
          src="/img/delete-x.svg"
          width={18}
          height={18}
          alt="delete"
          preview={false}
        />
      ),
      onClick: () => {
        // handleCLickDelete();
        setIsConfirmModalOpen(true);
      },
      type: "delete",
      isDisabled: selectedRows.length === 0,
    },
  ];

  return (
    <div className="content-container flex flex-col">
      <div className="h-[50px]">
        <FilterGroup
          titleTooltipSearch="Search by Name, Address"
          haveInputSearch
          placeholderSearch="Search"
          onSearch={handleSearch}
          listButton={listButton}
        />
      </div>
      <div className="margin-bottom flex flex-col justify-between h-[100%]">
        <Table
          className="partner-table"
          columns={columns}
          dataSource={addKeys(storeQuery.data?.data ?? [])}
          loading={storeQuery.isFetching}
          pagination={false}
          scroll={{
            x: Config.LAYOUT_CONFIG.tableWidth,
            y: Config.LAYOUT_CONFIG.tableHeight,
          }}
          onChange={(_pagination, filters) => {
            setQuery((prevState) => ({
              ...prevState,
              ...filters,
            }));
          }}
        />
        <div className="mt-2 flex justify-end">
          <Pagination
            current={query.page}
            pageSize={query.perpage}
            total={totalData}
            size="small"
            pageSizeOptions={["50", "100", "150"]}
            showSizeChanger
            onChange={(page, pageSize) => {
              setQuery((prevState) => ({
                ...prevState,
                page,
                perpage: pageSize,
              }));
            }}
          />
        </div>
      </div>
      <ConfirmModal
        type="Delete"
        isModalOpen={isConfirmModalOpen}
        setIsModalOpen={(value) => setIsConfirmModalOpen(value)}
        confirmAction={() => handleCLickDelete()}
      />
    </div>
  );
}
