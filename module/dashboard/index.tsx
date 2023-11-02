import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import GeneralStats from "@app/module/dashboard/GeneralStats";
import CheckinStats from "@app/module/dashboard/CheckinStats";
import TrafficStats from "@app/module/dashboard/TrafficStats";
import {useState} from "react";
import dynamic from "next/dynamic";
import {Spin} from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartBarDetail = dynamic(
  () => import("@app/module/dashboard/ParticipantStats"),
  {
    // eslint-disable-next-line react/no-unstable-nested-components
    loading: () => (
      <div className="h-[30vh] text-center pt-[15vh] bg-white rounded-2xl mb-2">
        <Spin />
      </div>
    ),
    ssr: false,
  }
);

export function Dashboard(): JSX.Element {
  const [idStoreFilter, setIdStoreFilter] = useState<number[]>();

  return (
    <div className="dashboard-page mt-[10px]">
      <GeneralStats id={idStoreFilter} />
      <CheckinStats filter={(value) => setIdStoreFilter(value || undefined)} />
      <TrafficStats />
      <ChartBarDetail />
    </div>
  );
}
