import "./index.scss";
import {Line} from "react-chartjs-2";
import {ChartOptions, ChartData, ScriptableContext} from "chart.js";
import {useTranslation} from "react-i18next";
import {DatePicker} from "antd";
import {useEffect, useState} from "react";
import ApiDashboard, {IStatsQuery} from "@app/api/ApiDashboard";
import moment from "moment/moment";

const emptyDataSet: number[] = [];
for (let i = 0; i < 31; i++) {
  emptyDataSet.push(0);
}
const options: ChartOptions<"line"> = {
  plugins: {
    legend: {
      align: "end",
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {display: false},
    },
    y: {
      beginAtZero: true,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function TrafficStats(): JSX.Element {
  const {t} = useTranslation();

  const [query, setQuery] = useState<IStatsQuery>({
    year: moment().format("YYYY"),
    month: "",
  });
  const [totalVisitor, setTotalVisitor] = useState<number>(0);
  const [trafficStats, setTrafficStats] = useState(emptyDataSet);
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
  const generateLabels = (month: string, year: string) => {
    // console.log("object", month, year);
    if (month && year && month !== "Invalid date") {
      // console.log("month");
      return momentDay;
    }
    // console.log("year");
    return arr;
  };

  const chartData: ChartData<"line"> = {
    labels: generateLabels(String(selectedMonth), String(selectedYear)),
    datasets: [
      {
        label: t("dashboard.visitors"),
        data: trafficStats,
        borderColor: "rgba(126, 209, 215, 1)",
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const {ctx} = context.chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 180);
          gradient.addColorStop(0, "rgba(126, 209, 215, 1)");
          gradient.addColorStop(1, "rgba(126, 209, 215, 0)");
          return gradient;
        },
        tension: 0.1,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    ApiDashboard.getTrafficStats(query).then((res) => {
      let total = 0;
      const newDataTraffic = [...emptyDataSet];
      res?.forEach((dt) => {
        if (dt.day) {
          newDataTraffic[dt.day - 1] = dt.total_traffic;
        } else {
          newDataTraffic[dt.month - 1] = dt.total_traffic;
        }

        total += dt.total_traffic;
      });
      setTrafficStats(newDataTraffic);
      setTotalVisitor(total);
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
    <div className="line-chart-section">
      <div className="flex justify-between gap-4 flex-wrap w-100">
        <div className="overall-stats">
          <h1>{t("dashboard.daily_traffic")}</h1>
          <h2>{`${totalVisitor} ${t("dashboard.visitors")}`}</h2>
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
            // defaultValue={moment()}
            style={{marginRight: "12px"}}
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
            picker="year"
            defaultValue={moment()}
            allowClear={false}
          />
        </div>
      </div>
      <div className="line-chart">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
