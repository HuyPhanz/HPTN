import "./index.scss";
import {
  Image,
  Modal,
  notification,
  Pagination,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {ColumnsType} from "antd/lib/table";
import {useTranslation} from "react-i18next";
import {ImportOutlined, PlusOutlined} from "@ant-design/icons";
import Config from "@app/config";
import FilterGroup from "@app/components/FilterGroup";
import {useRouter} from "next/router";
import React, {Key, useState} from "react";
import UploadFileModal from "@app/components/UploadFileModal";
import {useQuery} from "react-query";
import ApiStore, {
  IStoreTableQuery,
  IStoreTableResponse,
} from "@app/api/ApiStore";
import addKeys from "@app/utils/convert/AddKeys";
import {getCategories} from "@app/api/ApiCategories";
import ConfirmModal from "@app/components/ConfirmModal";
import store from "@app/redux/store";
import {IAccountRole} from "@app/types";
import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";

export function PartnerManagement(): JSX.Element {
  const {t} = useTranslation();
  const router = useRouter();
  if (store.getState().user.role === IAccountRole.STORE) {
    router.push("/partners/store");
  }
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const [openModal, setOpenModal] = useState(false);
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

  const categoryQuery = useQuery(["category-filter"], () => getCategories({}));

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

  function handleSendMail(storeId: string | number, email?: string): void {
    if (email) {
      const abortController = new AbortController();
      const {signal} = abortController;

      Modal.confirm({
        title: "Email accounts and passwords",
        content: (
          <span>
            Email account and new password to email{" "}
            <span className="font-medium text-fuchsia-600">{email}</span>
          </span>
        ),
        onOk: async () => {
          await fetcher({
            url: Constant.API_PATH.EMAIL_STORE(storeId),
            method: "post",
            signal,
          })
            .then(() => {
              notification.success({
                message: (
                  <span>
                    Email account and password to{" "}
                    <span className="font-medium text-fuchsia-600">
                      {email}
                    </span>{" "}
                    successfully
                  </span>
                ),
              });
            })
            .catch(() => {
              notification.error({message: "Mail failed, please try again!"});
            });
        },
        onCancel: () => {
          // When the user cancels, abort the fetch request
          abortController.abort();
          notification.warning({message: "Request canceled!"});
        },
      });
    } else {
      notification.error({message: "Store doesn't have email yet!"});
    }
  }

  const columns: ColumnsType<IStoreTableResponse> = [
    {
      title: t("table.index"),
      width: 20,
      render: (_val, _record, index) =>
        (query.page - 1) * query.perpage + index + 1,
    },
    {
      title: t("partner.logo"),
      width: 60,
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
      width: 70,
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
      title: "City",
      width: 50,
      dataIndex: ["state_id"],
      render: (_val, record) => record?.state?.name ?? "-",
    },
    {
      title: t("partner.address"),
      width: 100,
      dataIndex: "address",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.check_in"),
      width: 50,
      dataIndex: "CheckIn",
      render: (val) => val ?? "-",
    },
    {
      title: t("partner.purchase"),
      width: 50,
      dataIndex: "Purchase",
      render: (val) => val ?? "-",
    },
    {
      title: t("table.action"),
      dataIndex: "id",
      align: "center",
      width: 60,
      fixed: "right",
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
            src="/img/icon/purple_mail_icon.png"
            preview={false}
            onClick={(): void => {
              handleSendMail(val, record.email);
            }}
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
      title: "Add Business",
      startIcon: <PlusOutlined />,
      onClick: () => {
        router.push("/partners/new");
      },
      type: "add",
    },
    {
      title: "Import",
      startIcon: <ImportOutlined />,
      onClick: () => {
        setOpenModal(true);
      },
      type: "import",
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
      {store.getState().user.role === IAccountRole.STORE ? undefined : (
        <>
          <UploadFileModal
            title="Import Businesses"
            open={openModal}
            onCancel={(): void => {
              setOpenModal(false);
            }}
            onSuccess={() => {
              setOpenModal(false);
              storeQuery.refetch();
            }}
            className="modal-import-partner"
          />
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
              rowSelection={{
                selectedRowKeys: selectedRows,
                onChange: (keys: Key[]): void => {
                  setSelectedRows(keys);
                },
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
        </>
      )}
    </div>
  );
}
