import "./index.scss";
import {Col, Image, Row} from "antd";
import ApiDashboard, {IGeneralStatsResponse} from "@app/api/ApiDashboard";
import {useQuery} from "react-query";

interface INumberBoxProps {
  icon: JSX.Element;
  title: string;
  stats: number;
  // loading?: boolean;
}

function NumberBox(props: INumberBoxProps): JSX.Element {
  const {icon, title, stats} = props;
  return (
    <div className="box">
      <div className="box-icon">{icon}</div>
      <div className="box-content">
        <h2>{title}</h2>
        <h1>{stats}</h1>
      </div>
    </div>
  );
}

function convertToBox(raw?: IGeneralStatsResponse): INumberBoxProps[] {
  return [
    {
      title: "CUSTOMERS",
      icon: <Image src="/img/icon/customer-stats-icon.png" preview={false} />,
      stats: raw?.customer ?? 0,
    },
    {
      title: "BUSINESSES",
      icon: <Image src="/img/icon/business-stats-icon.png" preview={false} />,
      stats: raw?.business ?? 0,
    },
    {
      title: "CHECKED-IN WITHOUT PURCHASE",
      icon: <Image src="/img/icon/checkin-stats-icon.png" preview={false} />,
      stats: raw?.checked_in ?? 0,
    },
    {
      title: "CHECKED-IN WITH PURCHASE",
      icon: <Image src="/img/icon/purchased-stats-icon.png" preview={false} />,
      stats: raw?.purchased ?? 0,
    },
  ];
}

export default function GeneralStats(prop: {id?: number[]}): JSX.Element {
  const {data} = useQuery(["general-query", prop.id], () =>
    ApiDashboard.getGeneralStats({store_id: prop.id})
  );

  return (
    <div className="number-section">
      <Row gutter={[16, 16]}>
        {convertToBox(data).map((box, index) => (
          <Col key={index} xs={24} md={12} lg={6}>
            <NumberBox {...box} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
