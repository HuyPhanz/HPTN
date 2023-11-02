import "./index.scss";
import {Image, notification, Pagination, Table, Tag, Tooltip} from "antd";
import {ColumnsType} from "antd/lib/table";
import {useTranslation} from "react-i18next";
import Config from "@app/config";
import FilterGroup from "@app/components/FilterGroup";
import {useRouter} from "next/router";
import {useState} from "react";
import {useQuery} from "react-query";
import {IStoreTableQuery} from "@app/api/ApiStore";
import addKeys from "@app/utils/convert/AddKeys";
import store from "@app/redux/store";
import {IAccountRole} from "@app/types";
import {getCategories} from "@app/api/ApiCategories";
import ApiEvent, {IStoreQrTableResponse} from "@app/api/ApiEvent";
import {DownloadOutlined} from "@ant-design/icons";
import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";
import html2canvas from "html2canvas";

function handleDownload(
  eventId: string,
  storeId: string,
  storeName: string
): void {
  fetcher<{code: string; image: string}>({
    url: Constant.API_PATH.GENERATE_QR_CODE,
    method: "get",
    params: {
      event: btoa(eventId),
      store: btoa(storeId),
      type: 1,
    },
    baseURL: Config.NETWORK_CONFIG.API_APP_URL,
  })
    .then((res) => {
      const divElement = document.createElement("div");
      divElement.id = `checkinQr`;
      divElement.className = "text-center d-none w-fit p-5";

      // Create the image element
      const imgElement = document.createElement("img");
      imgElement.src = `data:image/png;base64,${res.image}`;
      imgElement.width = 180;
      imgElement.alt = "checkin-qr";

      // Create the div element for the code
      const codeDiv = document.createElement("div");
      codeDiv.className = "mt-2 text-xl font-medium";
      codeDiv.textContent = `Code: ${res.code}`;

      // Append the image and code div to the main div
      divElement.appendChild(imgElement);
      divElement.appendChild(codeDiv);
      document.body.appendChild(divElement);

      html2canvas(divElement).then(function (canvas) {
        // Chuyển đổi canvas thành một URL hình ảnh
        const imgData = canvas.toDataURL("image/png");

        // Tạo một thẻ a để tải ảnh xuống
        const a = document.createElement("a");
        a.href = imgData;
        a.download = `checkin_qr_${res.code}_${storeName}.png`;
        a.click();
      });
      document.body.removeChild(divElement);
    })
    .catch(() => {
      notification.error({
        message: `Unable to download checkin qr, please try again!`,
      });
    });

  fetcher<{code: string; image: string}>({
    url: Constant.API_PATH.GENERATE_QR_CODE,
    method: "get",
    params: {
      event: btoa(eventId),
      store: btoa(storeId),
      type: 3,
    },
    baseURL: Config.NETWORK_CONFIG.API_APP_URL,
  })
    .then((res) => {
      const divElement = document.createElement("div");
      divElement.id = `purchaseQr`;
      divElement.className = "text-center d-none w-fit p-5";

      // Create the image element
      const imgElement = document.createElement("img");
      imgElement.src = `data:image/png;base64,${res.image}`;
      imgElement.width = 180;
      imgElement.alt = "purchase-qr";

      // Create the div element for the code
      const codeDiv = document.createElement("div");
      codeDiv.className = "mt-2 text-xl font-medium";
      codeDiv.textContent = `Code: ${res.code}`;

      // Append the image and code div to the main div
      divElement.appendChild(imgElement);
      divElement.appendChild(codeDiv);
      document.body.appendChild(divElement);

      html2canvas(divElement).then(function (canvas) {
        // Chuyển đổi canvas thành một URL hình ảnh
        const imgData = canvas.toDataURL("image/png");

        // Tạo một thẻ a để tải ảnh xuống
        const a = document.createElement("a");
        a.href = imgData;
        a.download = `purchase_qr_${res.code}_${storeName}.png`;
        a.click();
      });
      document.body.removeChild(divElement);
    })
    .catch(() => {
      notification.error({
        message: `Unable to download purchase qr, please try again!`,
      });
    });
}

export function ListBusiness(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  const id: string = router.query.id as string;

  const [query, setQuery] = useState<IStoreTableQuery>({page: 1, perpage: 100});
  const [totalData, setTotalData] = useState<number>(0);

  const storeQuery = useQuery(
    ["business-qr-query", query, id],
    () => ApiEvent.getListBusinessQr(id, query),
    {
      onSuccess: (res) => {
        setTotalData(res.total);
      },
    }
  );

  const categoryQuery = useQuery(["category-filter"], () => getCategories({}));

  const handleSearch = (val: string) => {
    setQuery((prevState) => ({
      ...prevState,
      keyword: val,
      page: 1,
    }));
  };

  const columns: ColumnsType<IStoreQrTableResponse> = [
    {
      title: t("table.index"),
      width: 20,
      render: (_val, _record, index) =>
        (query.page - 1) * query.perpage + index + 1,
    },
    {
      title: t("partner.logo"),
      width: 40,
      dataIndex: "logo",
      render: (val) => (
        <Image
          src={val && val !== "" ? val : "/img/default-logo.png"}
          alt="logo"
          width={60}
          height={60}
          fallback="/img/default-logo.png"
        />
      ),
    },
    {
      title: t("partner.name"),
      width: 60,
      dataIndex: "name",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.email"),
      width: 80,
      dataIndex: "email",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.phoneNumber"),
      width: 50,
      dataIndex: "phone",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.owner"),
      width: 60,
      dataIndex: "owner",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.category"),
      key: "category_id",
      width: 70,
      filters:
        categoryQuery.data?.data?.map((ca) => ({
          value: ca.id,
          text: ca.name,
        })) ?? [],
      filterSearch: true,
      render: (_val, record) => {
        if (record.category.length > 0) {
          const tempArray = record.category.map((ca) => ca.name);
          return (
            <Tooltip
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {tempArray.map((item, index) => (
                    <Tag style={{margin: "3px 3px"}} key={index}>
                      {item.trim()}
                    </Tag>
                  ))}
                </div>
              }
            >
              <div className="flex gap-2 list-category">
                {tempArray.map((item, index) => (
                  <Tag key={index}>{item.trim()}</Tag>
                ))}
              </div>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      title: "Checkin Qr",
      align: "center",
      width: 30,
      dataIndex: "imageCheckin",
      render: (val, record, index) =>
        val ? (
          <div id={`checkinQr-${index}`} className="text-center">
            <img src={val} width={60} alt="checkin-qr" />
            <div className="mt-2 font-medium">Code: {record.codeCheckin}</div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Purchase Qr",
      align: "center",
      width: 30,
      dataIndex: "imagePurchase",
      render: (val, record, index) =>
        val ? (
          <div id={`purchaseQr-${index}`} className="text-center">
            <Image src={val} width={60} alt="purchase-qr" />
            <div className="mt-2 font-medium">Code: {record.codePurchase}</div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_val, record, index) => (
        <DownloadOutlined
          className="text-2xl text-green-600 cursor-pointer hover:opacity-70"
          onClick={() => {
            handleDownload(id, record.id.toString(), record.name);
          }}
        />
      ),
    },
  ];

  return (
    <div className="content-container flex flex-col">
      {store.getState().user.role === IAccountRole.STORE ? undefined : (
        <>
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
        </>
      )}
    </div>
  );
}
