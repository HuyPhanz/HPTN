import "./index.scss";
import React, {useState, useEffect, useRef} from "react";
import {Bar, BarConfig, ChartRefConfig} from "@ant-design/charts";
import ApiDashboard, {
  IDataResponseParticipanr,
  IParticipantStatsQuery,
} from "@app/api/ApiDashboard";
import {useQuery} from "react-query";
import {ITableResponse} from "@app/types";
import ApiEvent, {IEventTableResponse} from "@app/api/ApiEvent";
import {Select} from "antd";
import StringHelper from "@app/utils/helper/StringHelper";

interface IParticipantDisplay {
  label: string;
  participant: number;
  type?: string;
}

const filterOptions = [
  {label: "Without purchase", value: "checkin"},
  {label: "With purchase", value: "purchase"},
];

function convertSerial(
  data: IDataResponseParticipanr[],
  filter?: "checkin" | "purchase"
): IParticipantDisplay[] {
  return data?.map((dt) => ({
    label: dt.name,
    participant:
      filter === "checkin"
        ? dt.checkin
        : filter === "purchase"
        ? dt.purchase
        : dt.allCheckIn,
  }));
}

export default function ParticipantStats(): JSX.Element {
  const [data, setData] = useState<IParticipantDisplay[]>([]);
  const [query, setQuery] = useState<IParticipantStatsQuery>({});
  const [dataFilterStore, setDataFilterStore] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const chartRef: ChartRefConfig = useRef();
  chartRef?.current?.changeSize(
    chartRef.current.chart.width,
    data.length * 36 + 16
  );
  const eventQuery = useQuery<ITableResponse<IEventTableResponse[]>>(
    ["event-query-filter"],
    () => ApiEvent.getListEvent()
  );

  useEffect(() => {
    ApiDashboard.getParticipantStats(query).then((res) => {
      if (res) {
        setData(convertSerial(res.data, query.sort));
        setDataFilterStore(res.store);
      }
    });
  }, [query]);

  const config: BarConfig = {
    data,
    yField: "label",
    xField: "participant",
    yAxis: {
      label: {
        autoRotate: false,
      },
    },
    chartRef: chartRef,
    scrollbar: false,
  };

  return (
    <div className="horizontal-bar-chart-section">
      <div className="flex justify-between gap-4 flex-wrap w-100">
        <div className="overall-stats">
          <h1>Compare business checkin</h1>
        </div>
        <div className="filter">
          <Select
            className="mr-2"
            allowClear
            placeholder="Sort"
            options={filterOptions}
            onChange={(val) =>
              setQuery((prevState) => ({...prevState, sort: val}))
            }
          />
          <Select
            showSearch
            allowClear
            loading={eventQuery.isFetching}
            placeholder="Filter by event"
            options={eventQuery?.data?.data.map((dt: IEventTableResponse) => ({
              label: dt.name,
              value: dt.id,
            }))}
            onChange={(val) =>
              setQuery((prevState) => ({...prevState, event_id: val}))
            }
            filterOption={(input, option) => {
              return StringHelper.normalizeText(option?.label ?? "").includes(
                StringHelper.normalizeText(input)
              );
            }}
            maxTagCount={1}
            maxTagTextLength={8}
            mode="multiple"
            className="mr-2"
          />
          <Select
            showSearch
            allowClear
            placeholder="Filter by store"
            options={dataFilterStore}
            onChange={(val) =>
              setQuery((prevState) => ({...prevState, store_id: val}))
            }
            filterOption={(input, option) => {
              return StringHelper.normalizeText(option?.label ?? "").includes(
                StringHelper.normalizeText(input)
              );
            }}
            maxTagCount={1}
            maxTagTextLength={8}
            mode="multiple"
          />
        </div>
      </div>
      <div className="bar-chart">
        <Bar {...config} />
      </div>
    </div>
  );
}
