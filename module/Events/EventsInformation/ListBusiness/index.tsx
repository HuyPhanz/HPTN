import "./index.scss";
import {Image, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {useTranslation} from "react-i18next";
import Config from "@app/config";
import FilterGroup from "@app/components/FilterGroup";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {useQuery} from "react-query";
import {IStoreTableQuery} from "@app/api/ApiStore";
import addKeys from "@app/utils/convert/AddKeys";
import ApiEvent, {IStoreQrTableResponse} from "@app/api/ApiEvent";
import {PlusSquareTwoTone} from "@ant-design/icons";
import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";

export function ListBusiness(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  const id: string = router.query.id as string;

  const [query, setQuery] = useState<IStoreTableQuery>({page: 1, perpage: 100});
  const [queryUnassigned, setQueryUnassigned] = useState<IStoreTableQuery>({
    page: 1,
    perpage: 100,
  });
  // const [totalData, setTotalData] = useState<number>(0);
  // const [totalDataUnassigned, setTotalDataUnassigned] = useState<number>(0);

  const storeQuery = useQuery(
    ["business-qr-query", query, id],
    () => ApiEvent.getListStoreAssigned(id, query),
    {
      onSuccess: (res) => {
        // setTotalData(res.total);
      },
    }
  );

  const storeQueryUnassigned = useQuery(
    ["business-qr-query-unassgined", queryUnassigned, id],
    () => ApiEvent.getListStoreUnassigned(id, queryUnassigned),
    {
      onSuccess: (res) => {
        // setTotalDataUnassigned(res.total);
      },
    }
  );

  const handleSearch = (val: string) => {
    setQuery((prevState) => ({
      ...prevState,
      keyword: val,
      page: 1,
    }));
  };

  const handleSearchUnassigned = (val: string) => {
    setQueryUnassigned((prevState) => ({
      ...prevState,
      keyword: val,
      page: 1,
    }));
  };

  function handleAddStore(storeId: string | number) {
    fetcher({
      url: Constant.API_PATH.STORE_TO_EVENT(storeId, id),
      method: "post",
    }).then((res) => {
      if (res) {
        storeQuery.refetch();
        storeQueryUnassigned.refetch();
      }
    });
  }

  function handleRemoveStore(storeId: string | number) {
    fetcher({
      url: Constant.API_PATH.STORE_TO_EVENT(storeId, id),
      method: "delete",
    }).then((res) => {
      if (res) {
        storeQuery.refetch();
        storeQueryUnassigned.refetch();
      }
    });
  }

  const columns: ColumnsType<IStoreQrTableResponse> = [
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
    {
      title: t("Category"),
      key: "category",
      width: 30,
      dataIndex: ["category", "name"],
      // filters:
      //   categoryQuery.data?.data?.map((ca) => ({
      //     value: ca.id,
      //     text: ca.name,
      //   })) ?? [],
      // filterSearch: true,
      render: (val) => val ?? "-",
    },
    {
      title: t("Address"),
      width: 60,
      dataIndex: "address",
      render: (val) => val ?? "-",
    },
    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_val, record, index) => (
        <Image
          width={30}
          height={30}
          className="hover-image"
          src="/img/icon/delete-icon.png"
          preview={false}
          onClick={(): void => {
            handleRemoveStore(record.id);
          }}
        />
      ),
    },
  ];

  const columnsUnassgined: ColumnsType<IStoreQrTableResponse> = [
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
    {
      title: t("Category"),
      key: "category",
      width: 30,
      dataIndex: ["category", "name"],
      // filters:
      //   categoryQuery.data?.data?.map((ca) => ({
      //     value: ca.id,
      //     text: ca.name,
      //   })) ?? [],
      // filterSearch: true,
      render: (val) => val ?? "-",
    },
    {
      title: t("Address"),
      width: 60,
      dataIndex: "address",
      render: (val) => val ?? "-",
    },
    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_val, record, index) => (
        <PlusSquareTwoTone
          className="hover-image"
          width={30}
          height={30}
          onClick={(): void => {
            handleAddStore(record.id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="content-container flex flex-col">
      <h1 className="mb-2 text-2xl font-bold">Store In Event</h1>
      <div className="h-[50px]">
        <FilterGroup
          titleTooltipSearch="Search by Name, Address"
          haveInputSearch
          placeholderSearch="Search"
          onSearch={handleSearch}
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
            x: 1280,
            y: Config.LAYOUT_CONFIG.tableHeight,
          }}
          onChange={(_pagination, filters) => {
            setQuery((prevState) => ({
              ...prevState,
              ...filters,
            }));
          }}
        />
        {/* <div className="mt-2 flex justify-end"> */}
        {/*  <Pagination */}
        {/*    current={query.page} */}
        {/*    pageSize={query.perpage} */}
        {/*    total={totalData} */}
        {/*    size="small" */}
        {/*    pageSizeOptions={["50", "100", "150"]} */}
        {/*    showSizeChanger */}
        {/*    onChange={(page, pageSize) => { */}
        {/*      setQuery((prevState) => ({ */}
        {/*        ...prevState, */}
        {/*        page, */}
        {/*        perpage: pageSize, */}
        {/*      })); */}
        {/*    }} */}
        {/*  /> */}
        {/* </div> */}
      </div>
      {/*
       *******
       *******
       *******
       *******
       *******
       *******
       */}
      <h1 className="mb-2 mt-5 text-2xl font-bold">Store Not In Event</h1>
      <div className="h-[50px]">
        <FilterGroup
          titleTooltipSearch="Search by Name, Address"
          haveInputSearch
          placeholderSearch="Search"
          onSearch={handleSearchUnassigned}
        />
      </div>
      <div className="margin-bottom flex flex-col justify-between h-[100%]">
        <Table
          className="partner-table"
          columns={columnsUnassgined}
          dataSource={addKeys(storeQueryUnassigned.data?.data ?? [])}
          loading={storeQueryUnassigned.isFetching}
          pagination={false}
          scroll={{
            x: 1280,
            y: Config.LAYOUT_CONFIG.tableHeight,
          }}
          onChange={(_pagination, filters) => {
            setQueryUnassigned((prevState) => ({
              ...prevState,
              ...filters,
            }));
          }}
        />
        {/* <div className="mt-2 flex justify-end"> */}
        {/*  <Pagination */}
        {/*    current={query.page} */}
        {/*    pageSize={query.perpage} */}
        {/*    total={totalData} */}
        {/*    size="small" */}
        {/*    pageSizeOptions={["50", "100", "150"]} */}
        {/*    showSizeChanger */}
        {/*    onChange={(page, pageSize) => { */}
        {/*      setQuery((prevState) => ({ */}
        {/*        ...prevState, */}
        {/*        page, */}
        {/*        perpage: pageSize, */}
        {/*      })); */}
        {/*    }} */}
        {/*  /> */}
        {/* </div> */}
      </div>
    </div>
  );
}
