import "./index.scss";
import {Bar} from "react-chartjs-2";
import {ChartOptions, ChartData} from "chart.js";
import {useTranslation} from "react-i18next";
import {DatePicker, Select} from "antd";
import {useEffect, useState} from "react";
import ApiDashboard, {IStatsQuery} from "@app/api/ApiDashboard";
import moment from "moment";

interface ICheckinStats {
  filter?: (value: number[]) => void;
}

const emptyDataSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const options: ChartOptions<"bar"> = {
  plugins: {
    legend: {
      align: "end",
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {display: false},
      stacked: true,
    },
    y: {
      beginAtZero: true,
      stacked: true,
      border: {dash: [4, 4]},
      ticks: {
        precision: 0,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function CheckinStats(prop: ICheckinStats): JSX.Element {
  const {filter} = prop;
  const {t} = useTranslation();
  const [valueSelect, setValueSelect] = useState<number[]>();
  const [optionSelect, setOptionSelect] = useState<
    {
      value: number;
      label: string;
    }[]
  >();

  const [query, setQuery] = useState<IStatsQuery>({
    year: moment().format("YYYY"),
    // year:"",
    month: "",
  });

  const [totalCheckin, setTotalCheckin] = useState<number>(0);
  const [purchasedStats, setPurchasedStats] = useState(emptyDataSet);
  const [checkinStats, setCheckinStats] = useState(emptyDataSet);
  const [selectedMonth, setSelectedMonth] = useState<string | number>("");
  const [selectedYear, setSelectedYear] = useState<string | number>(2023);
  const [momentDay, setMomentDay] = useState<number[]>([]);
  const [yearChoice, setYearChoice] = useState<string | number>(2023);
  const arr = [
    t("month.january"),
    t("month.february"),
    t("month.march"),
    t("month.april"),
    t("month.may"),
    t("month.june"),
    t("month.july"),
    t("month.august"),
    t("month.september"),
    t("month.october"),
    t("month.november"),
    t("month.december"),
  ];
  const generateLabels = (month: string | number, year: string | number) => {
    // console.log("dd", month, year);
    if (month && year && month !== "Invalid date") {
      // console.log("thang");
      return momentDay;
    }
    return arr;
  };
  const chartData: ChartData<"bar"> = {
    labels: generateLabels(String(selectedMonth), String(selectedYear)),
    datasets: [
      {
        label: t("dashboard.checkin_with_purchase"),
        data: purchasedStats,
        backgroundColor: "#6B61DF",
      },
      {
        label: t("dashboard.checkin_without_purchase"),
        data: checkinStats,
        backgroundColor: "#BAB4FF",
      },
    ],
  };
  const handleChangeSelect = (value: number[]) => {
    setQuery({...query, store_id: value});
    setValueSelect(value);
  };
  useEffect(() => {
    if (filter) {
      filter(valueSelect ?? []);
    }
  }, [valueSelect]);

  useEffect(() => {
    ApiDashboard.getCheckinStats(query).then((res) => {
      let total = 0;
      const newDataPurchased = [...emptyDataSet];
      const newDataCheckin = [...emptyDataSet];
      if (res && res.data) {
        res.data.forEach((dt) => {
          if (dt.day) {
            newDataPurchased[dt.day - 1] = dt.total_purchased;
            newDataCheckin[dt.day - 1] = dt.total_check_in;
          } else {
            newDataPurchased[dt.month - 1] = dt.total_purchased;
            newDataCheckin[dt.month - 1] = dt.total_check_in;
          }

          total += Number(dt.total_purchased);
          total += Number(dt.total_check_in);
        });
      }

      setOptionSelect(res.store);
      setPurchasedStats(newDataPurchased);
      setCheckinStats(newDataCheckin);
      setTotalCheckin(total);
    });
  }, [query]);

  useEffect(() => {
    // Khi selectedMonth hoặc selectedYear thay đổi, cập nhật lại chartData
    chartData.labels = generateLabels(
      String(selectedMonth),
      String(selectedYear)
    );
    // Thực hiện các công việc cập nhật dữ liệu khác (nếu cần) tại đây
  }, [selectedMonth, selectedYear]);

  const getDaysInMonth = (year: string, month: string) => {
    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };
  if (selectedYear === "Invalid date") {
    setSelectedYear(yearChoice);
    setQuery({year: yearChoice});
  }
  return (
    <div className="bar-chart-section">
      <div className="flex justify-between gap-4 flex-wrap w-100">
        <div className="overall-stats">
          <h1>{t("dashboard.total_checked_in")}</h1>
          <h2>{`${totalCheckin} ${t("dashboard.checked_ins")}`}</h2>
        </div>
        <div className="filter">
          <DatePicker
            onChange={(mm) => {
              const year = moment(mm).format("YYYY");
              const month = moment(mm).format("MM");
              const daysInSelectedMonth = getDaysInMonth(year, month);
              setQuery({
                year: year === "Invalid date" ? undefined : year,
                month: month === "Invalid date" ? undefined : month,
              });
              setSelectedMonth(moment(mm).format("MMMM"));
              setMomentDay(daysInSelectedMonth);
              setSelectedYear(moment(mm).format("YYYY"));
            }}
            placeholder="Month"
            picker="month"
            format="MMMM"
          />
          <DatePicker
            onChange={(mm) => {
              const year = moment(mm).format("YYYY");
              setQuery({year: year === "Invalid date" ? undefined : year});
              setSelectedYear(moment(mm).format("YYYY"));
              setYearChoice(moment(mm).format("YYYY"));
              setSelectedMonth("");
            }}
            placeholder="Year"
            onPanelChange={() => setQuery({month: ""})}
            picker="year"
            defaultValue={moment()}
            allowClear={false}
          />
          <Select
            maxTagCount={1}
            maxTagTextLength={8}
            mode="multiple"
            allowClear
            style={{width: "100%"}}
            onChange={handleChangeSelect}
            options={optionSelect}
            className="select-bussiness"
            placeholder="Filter by Bussiness"
          />
        </div>
      </div>
      <div className="bar-chart">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
