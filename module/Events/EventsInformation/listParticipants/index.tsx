import "./index.scss";
import FilterGroup from "@app/components/FilterGroup";
import React, {useState} from "react";
import {Image, Table} from "antd";
import type {ColumnsType, TableProps} from "antd/es/table";
import {useRouter} from "next/router";
import {IEventParticipant} from "@app/types";
import {useQuery} from "react-query";
import ApiEvent, {
  IParamParticipants,
  IResponseParticipants,
} from "@app/api/ApiEvent";
import {isArray} from "lodash";

export function ListParticipants(): JSX.Element {
  const router = useRouter();
  const id: string = router.query.id as string;
  const [paginationParam, setPaginationParam] = useState({
    current: 1,
    pageSize: 100,
  });
  const [paramListParticipants, setParamListParticipants] =
    useState<IParamParticipants>({
      page: 1,
      perpage: 100,
      keyword: "",
      sort_total_point: null,
      sort_checkin: null,
      sort_purchased: null,
    });
  const listParticipants = useQuery<IResponseParticipants>(
    ["list-participants", {paramListParticipants, id}],
    () => ApiEvent.getListParticipants(id, paramListParticipants)
  );
  const prizesQuantity = listParticipants.data?.prizes.length;
  const columns: ColumnsType<IEventParticipant> = [
    {
      title: "No",
      dataIndex: "id",
      width: 70,
      render: (val, record, index) => {
        if (record.top <= prizesQuantity) {
          return (
            <span style={{display: "flex"}}>
              <span>
                {(paginationParam.current - 1) * paginationParam.pageSize +
                  index +
                  1}
              </span>
              {record.top < 4 && (
                <Image
                  src={
                    record.top === 1
                      ? "/img/icon/medal-gold.svg"
                      : record.top === 2
                      ? "/img/icon/medal-silver.svg"
                      : "/img/icon/medal-brown.svg"
                  }
                  preview={false}
                  width={30}
                  height={30}
                  style={{marginLeft: "10px"}}
                  alt=""
                />
              )}
            </span>
          );
        }
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Name",
      dataIndex: "fullname",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      width: 200,
    },
    {
      title: "Total point",
      dataIndex: "total_point",
      key: "total_point",
      width: 150,
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Checked-in",
      dataIndex: "CheckIn",
      key: "CheckedIn",
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Purchased",
      dataIndex: "Purchase",
      key: "purchased_point",
      width: 150,
      sorter: {
        multiple: 3,
      },
    },
  ];
  const rowClassName = (record: any) => {
    if (record.top <= prizesQuantity) {
      return record.top === 1
        ? "top1"
        : record.top === 2
        ? "top2"
        : record.top === 3
        ? "top3"
        : "";
    }
    return "";
  };
  const onChange: TableProps<IEventParticipant>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setParamListParticipants((prev) => {
      let paramTotalPointEvent: string | null = null;
      let paramCheckedIn: string | null = null;
      let paramPurchasePoint: string | null = null;
      if (isArray(sorter)) {
        sorter?.forEach((value) => {
          if (value.columnKey === "total_point") {
            paramTotalPointEvent = value.order
              ? value.order.slice(0, -3)
              : null;
          } else if (value.columnKey === "CheckedIn") {
            paramCheckedIn = value.order ? value.order.slice(0, -3) : null;
          } else {
            paramPurchasePoint = value.order ? value.order.slice(0, -3) : null;
          }
        });
      } else if (sorter) {
        if (sorter.columnKey === "total_point") {
          paramTotalPointEvent = sorter.order
            ? sorter.order.slice(0, -3)
            : null;
        } else if (sorter.columnKey === "CheckedIn") {
          paramCheckedIn = sorter.order ? sorter.order.slice(0, -3) : null;
        } else {
          paramPurchasePoint = sorter.order ? sorter.order.slice(0, -3) : null;
        }
      }
      if (pagination.current && pagination.pageSize) {
        setPaginationParam({
          current: pagination.current,
          pageSize: pagination.pageSize,
        });
      }

      return {
        ...prev,
        page: pagination.current,
        perpage: pagination.pageSize,
        sort_total_point: paramTotalPointEvent,
        sort_checkin: paramCheckedIn,
        sort_purchased: paramPurchasePoint,
      };
    });
  };
  const pagination = {
    current: paramListParticipants.page,
    pageSize: paramListParticipants.perpage,
    pageSizeOptions: ["50", "100", "150"],
    showSizeChanger: true,
    showQuickJumper: false,
    total: listParticipants.data?.participants.total,
  };
  return (
    <div className="event-participants-container content-container">
      <FilterGroup
        haveInputSearch
        titleTooltipSearch="Search by Name"
        placeholderSearch="Search"
        onSearch={(value) => {
          setParamListParticipants((prevState) => {
            return {
              ...prevState,
              keyword: value,
              page: 1,
            };
          });
        }}
      />
      <Table
        rowKey="id"
        rowClassName={rowClassName}
        columns={columns}
        dataSource={listParticipants.data?.participants.data}
        loading={listParticipants.isLoading}
        onChange={onChange}
        pagination={pagination}
      />
    </div>
  );
}
