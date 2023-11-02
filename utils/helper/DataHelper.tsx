import _ from "lodash";

const colors = {
  primary: "#1890FF",
  success: "#52C41A",
  warning: "orange",
  danger: "#FF0000",
};

export type dataHelper =
  | "stock_state"
  | "stock_state2"
  | "gender"
  | "staff_status"
  | "staff_status_filter"
  | "status_service_pack"
  | "status_request_form"
  | "error_code"
  | "button_status"
  | "button_state"
  | "button_request"
  | "button_request_edit"
  | "campaign_status"
  | "campaign_isPin"
  | "order_status"
  | "order_type"
  | "order_service"
  | "servicePack"
  | "payment_type"
  | "cost_type"
  | "cost_vat"
  | "time_type"
  | "product_type"
  | "product_status"
  | "product_state"
  | "product_unit"
  | "warehouse_request_status"
  | "material_status"
  | "warehouse_import_status_company"
  | "warehouse_request_status_company"
  | "warehouse_request_status_branch"
  | "notify_type"
  | "reminder_status"
  | "customer_type"
  | "customer_resource"
  | "customer_label"
  | "purifier_status"
  | "contract_status";

export const DataHelperConst = {
  GENDER: "gender",

  STAFF_STATUS: "staff_status",
  STATUS_SERVICE_PACK: "status_service_pack",
  STATUS_REQUEST_FORM: "status_request_form",

  // ORDER
  ORDER_STATUS: "order_status",

  ORDER_TYPE: "order_type",

  ORDER_SERVICE: "order_service",

  PAYMENT_TYPE: "payment_type",

  COST_TYPE: "cost_type",

  COST_VAT: "cost_vat",

  // Product
  PRODUCT_TYPE: "product_type",

  PRODUCT_STATUS: "product_status",
  PRODUCT_UNIT: "product_unit",
  PRODUCT_STOCK_STATUS: "product_stock_status",

  // Google
  MARKER: "marker",

  // Warehouse
  WAREHOUSE_REQUEST_STATUS: "warehouse_request_status",

  MATERIAL_STATUS: "material_status",

  WAREHOUSE_IMPORT_STATUS_COMPANY: "warehouse_import_status_company",

  WAREHOUSE_REQUEST_STATUS_COMPANY: "warehouse_request_status_company",

  WAREHOUSE_REQUEST_STATUS_BRANCH: "warehouse_request_status_branch",

  // Notifications
  NOTIFY_TYPE: "notify_type",

  REMINDER_STATUS: "reminder_status",

  // Customer
  CUSTOMER_TYPE: "customer_type",

  CUSTOMER_RESOURCE: "customer_resource",

  CUSTOMER_LABEL: "customer_label",

  CONTRACT_STATUS: "contract_status",

  PURIFIER_STATUS: "purifier_status",
  TIME_TYPE: "time_type",
};

const data: any = {
  relation_ship: [
    {name: "Bố", id: 0},
    {name: "Mẹ", id: 1},
    {name: "Anh", id: 2},
    {name: "Chị", id: 3},
    {name: "Con", id: 4},
    {name: "Chú", id: 5},
    {name: "Dì", id: 6},
    {name: "Em gái", id: 7},
    {name: "Em trai", id: 8},
    {name: "Ông", id: 9},
    {name: "Bà", id: 10},
    {name: "Khác", id: 11},
  ],
  // Information
  stock_state: [
    {id: 0, name: "Chưa tiếp nhận"},
    {id: 1, name: "Đã duyệt"},
    {id: 2, name: "Đã từ chối"},
    {id: 3, name: "Đã tiếp nhận"},
    {id: 4, name: "Chờ xuất kho"},
    {id: 5, name: "Đã xuất kho"},
    {id: 6, name: "Đã nhận hàng"},
    {id: 7, name: "Đã thanh toán"},
    {id: 8, name: "Hoàn thành"},
  ],

  stock_state2: [
    {id: 0, name: "Chưa nhận hàng"},
    {id: 4, name: "Chờ nhập kho"},
    {id: 6, name: "Đã nhận hàng"},
  ],

  gender: [
    {id: "Nam", name: "Nam"},
    {id: "Nữ", name: "Nữ"},
    {id: "Khác", name: "Khác"},
  ],
  staff_status: [
    {id: "1", name: "Đang làm việc", color: colors.success},
    {id: "0", name: "Đã nghỉ việc", color: colors.danger},
  ],
  staff_status_filter: [
    {id: "1", name: "Đang làm việc", color: colors.success},
    {id: "0", name: "Đã nghỉ việc", color: colors.danger},
  ],
  status_service_pack: [
    {id: 1, name: "Đang hoạt động", color: colors.success},
    {id: 0, name: "Không hoạt động", color: colors.warning},
  ],
  status_request_form: [
    {id: 1, name: "Đã duyệt", color: colors.success},
    {id: 0, name: "Chưa duyệt", color: colors.primary},
    {id: 2, name: "Đã từ chối", color: colors.danger},
  ],
  // error code
  error_code: [
    {errorCode: "REGEX_PHONE", message: "Số điện thoại không hợp lệ"},
    {errorCode: "010009", message: "Vui lòng đổi trạng thái"},
  ],
  // button_status
  button_status: [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"},
    {id: 2, name: "Đã xóa"},
  ],
  button_state: [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"},
  ],
  button_request: [
    {id: 1, name: "Hoạt động"},
    {id: 0, name: "Không hoạt động"},
    {id: 2, name: "Đã xóa"},
    {id: 3, name: "Đã tạo đơn"},
  ],
  button_request_edit: [
    {id: 0, name: "Không hoạt động"},
    {id: 1, name: "Hoạt động"},
    {id: 3, name: "Đã tạo đơn"},
  ],
  // campaign
  campaign_status: [
    {
      id: 1,
      name: "Đang hoạt động",
      background: "rgba(41, 172, 246, 0.08)",
      color: "#5570F1",
    },
    {
      id: 3,
      name: "Tạm dừng",
      background: "rgba(246, 41, 52, 0.08)",
      color: "#FF4F64",
    },
    {
      id: 4,
      name: "Hoàn thành",
      background: "rgba(41, 246, 111, 0.08)",
      color: "#34C900",
    },
  ],
  campaign_isPin: [
    {id: false, name: "Không ưu tiên"},
    {id: true, name: "Ưu tiên"},
  ],
  // Order
  order_status: [
    // { id: 0, name: "Đã xóa", color: colors.primary },
    {id: 10, name: "Đơn chưa xác nhận", color: "state-Processing"},
    {id: 2, name: "Đơn mới", color: "state-InActive"},
    {id: 5, name: "Sale Admin tiếp nhận", color: "state-Receive"},
    {id: 3, name: "NVKD chưa tiếp nhận", color: "state-Active"},
    {id: 4, name: "NVKD từ chối", color: "state-NotAccept"},
    {id: 6, name: "Đơn đang đi", color: "state-CustomerCare"},
    {id: 8, name: "Đơn thành công", color: "state-Done"},
    {id: 7, name: "Đơn đã chăm sóc", color: "state-Done"},
    {id: 1, name: "Đơn hủy", color: "state-Canceled"},
  ],
  order_type: [
    {id: 0, name: "Đơn thường", color: colors.primary},
    {id: 1, name: "Đơn bảo hành", color: colors.success},
    {id: 2, name: "Đơn chăm sóc lại", color: colors.success},
    {id: 3, name: "Đơn PG", color: colors.success},
    {id: 4, name: "Đơn nút bấm", color: colors.success},
    {id: 5, name: "Đơn Affiliate", color: colors.success},
  ],
  order_service: [
    {id: 1, name: "Tư vấn"},
    {id: 2, name: "Bảo dưỡng/Bảo hành"},
    {id: 3, name: "Thay lõi"},
    {id: 4, name: "Lắp máy"},
  ],
  servicePack: [
    {id: 1, name: "Trọn đời 3 lõi"},
    {id: 2, name: "Trọn đời 9 lõi"},
    {id: 3, name: "1 năm"},
    {id: 4, name: "3 năm"},
  ],
  payment_type: [
    {id: 5, name: "Thanh toán ngay"},
    {id: 6, name: "Công nợ"},
  ],
  cost_type: [
    {id: 1, name: "Telesales thay lõi"},
    {id: 2, name: "Digital marketing thay lõi"},
    {id: 3, name: "F2F thay lõi"},
    {id: 4, name: "Telesales bán máy"},
    {id: 5, name: "Digital marketing bán máy"},
    {id: 6, name: "F2F bán máy"},
    {id: 7, name: "Telesales thuê máy"},
    {id: 8, name: "Digital marketing thuê máy"},
    {id: 9, name: "F2F thuê máy"},
    {id: 10, name: "Khác"},
    {id: 11, name: "Lương"},
    {id: 12, name: "Thưởng"},
  ],
  cost_vat: [
    {id: true, name: "Có VAT"},
    {id: false, name: "Không VAT"},
  ],

  time_type: [
    {id: 1, name: "Giờ sáng"},
    {id: 2, name: "Giờ chiều"},
    {id: 23, name: "Cả ngày"},
  ],

  // Product
  product_type: [
    {id: 1, name: "Máy lọc"},
    {id: 2, name: "Lõi lọc"},
    {id: 3, name: "Khác"},
  ],
  product_status: [
    {id: true, name: "Có sẵn", color: colors.success},
    {id: false, name: "Không có sẵn", color: colors.danger},
  ],

  product_state: [
    {id: 2, name: "Đã xóa", color: colors.danger},
    {id: 1, name: "Đang kinh doanh", color: colors.success},
    {id: 0, name: "Dừng kinh doanh", color: colors.warning},
  ],

  product_unit: [
    {id: "Cái", name: "Cái"},
    {id: "Chiếc", name: "Chiếc"},
    {id: "Kg", name: "Kg"},
    {id: "VNĐ", name: "VNĐ"},
    {id: "Bộ", name: "Bộ"},
  ],

  // Google
  marker: [
    {id: "marker", name: null},
    {id: "person", name: "/img/marker/marker-person.png"},
    {id: "branch", name: "/img/marker/marker-store.png"},
    {id: "config", name: "/img/marker/marker-config.png"},
    {id: "car", name: "/img/marker/marker-car.png"},
    {id: "technical-doing", name: "/img/marker/marker-anmoga-doing.png"},
    {id: "technical-free", name: "/img/marker/marker-anmoga-free.png"},
  ],

  // Warehouse
  warehouse_request_status: [
    {id: 0, name: "Chờ xử lý", color: colors.primary},
    {id: 1, name: "Đang vận chuyển", color: colors.primary},
    {id: 2, name: "Đã hủy", color: colors.danger},
    {id: 3, name: "Đã hoàn thành", color: colors.success},
  ],
  material_status: [
    {id: 1, name: "Chưa bán", color: colors.primary},
    {id: 2, name: "Đã bán", color: colors.success},
  ],
  warehouse_import_status_company: [
    {id: 0, name: "Chờ xử lý", color: colors.primary},
    {id: 1, name: "Đang vận chuyển", color: colors.primary},
    {id: 2, name: "Đã hủy", color: colors.danger},
    {id: 3, name: "Đã nhập hàng", color: colors.success},
  ],
  warehouse_request_status_company: [
    {id: 0, name: "Chờ xử lý", color: colors.primary},
    {id: 1, name: "Đang vận chuyển", color: colors.primary},
    {id: 2, name: "Đã hủy", color: colors.danger},
    {id: 3, name: "Đã giao", color: colors.success},
  ],
  warehouse_request_status_branch: [
    {id: 0, name: "Chờ xử lý", color: colors.primary},
    {id: 1, name: "Đang vận chuyển", color: colors.primary},
    {id: 2, name: "Đã hủy", color: colors.danger},
    {id: 3, name: "Đã nhận", color: colors.success},
  ],

  // Notifications
  notify_type: [
    {
      id: 1,
      name: "Nhân viên được tạo mới",
      icon: "user",
      description: "Nhân sự {content} vừa được tạo mới",
    },
    {
      id: 2,
      name: "Bảo trì",
      icon: "settings",
      description: "Hệ thống bảo trì trong ít phút",
    },
    {
      id: 3,
      name: "Lịch nhắc",
      icon: "reminder",
      description: "Có lịch nhắc mới: {content}",
    },
    {
      id: 4,
      name: "Có đơn hàng mới được thêm",
      icon: "order",
      description: "Đơn hàng {content} mới được thêm",
    },
    {
      id: 5,
      name: "Phòng điều hành đã nhận đơn",
      icon: "order",
      description: "Đơn hàng {content} đã được tiếp nhận",
    },
    {
      id: 6,
      name: "Có đơn hàng mới được giao",
      icon: "order",
      description: "Đơn hàng {content} đã được giao cho CVKT",
      navigate: "/order-management-for-technical",
    },
    {
      id: 7,
      name: "Chuyên viên kỹ thuật nhận đơn",
      icon: "delivery",
      description: "Đơn hàng {content} đã được CVKT tiếp nhận",
    },
    {
      id: 8,
      name: "Chuyên viên kỹ thuật đã hoàn thành đơn",
      icon: "check",
      description: "Đơn hàng {content} đã được hoàn thành",
    },
    {
      id: 10,
      name: "Yêu cầu nhập hàng showroom",
      icon: "box",
      description: "Có yêu cầu nhập hàng showroom mới {content}",
    },
    {
      id: 11,
      name: "Duyệt nhập hàng showroom",
      icon: "box",
      description: "Yêu cầu nhập hàng {content} đã được duyệt",
    },
    {
      id: 12,
      name: "Hủy nhập hàng showroom",
      icon: "prohibition",
      description: "Yêu cầu nhập hàng {content} đã bị hủy",
    },
    {
      id: 15,
      name: "Yêu cầu xuất vật tư",
      icon: "tool-box",
      description: "Có yêu cầu xuất vật tư mới {content}",
    },
    {
      id: 16,
      name: "Duyệt yêu cầu xuất vật tư",
      icon: "tool-box",
      description: "Yêu cầu xuất vật tư {content} đã được duyệt",
      navigate: "/material",
    },
    {
      id: 17,
      name: "Hủy duyệt yêu cầu xuất vật tư",
      icon: "prohibition",
      description: "Yêu cầu xuất vật tư {content} đã bị hủy",
      navigate: "/material",
    },
    {
      id: 20,
      name: "Bình luận",
      icon: "reminder",
      description: "Bạn được nhắc đến trong một bình luận",
    },
  ],
  reminder_status: [
    {id: 1, name: "Chưa gửi", color: colors.primary},
    {id: 2, name: "Đã gửi", color: colors.success},
    {id: 3, name: "Đã hủy", color: colors.danger},
  ],

  // Customer
  customer_type: [
    {id: 1, name: "Doanh nghiệp"},
    {id: 2, name: "Cá nhân"},
  ],
  customer_resource: [
    {id: 1, name: "Kênh Telesales", color: colors.primary},
    {id: 2, name: "Digital Marketing", color: colors.success},
    {id: 3, name: "Kênh F2F", color: colors.warning},
    // {id: 4, name: "Kênh tự do"}
  ],
  customer_label: [
    {id: 1, name: "Tiếp cận mới", color: colors.primary},
    {id: 2, name: "Tiềm năng", color: colors.success},
    {id: 3, name: "Đã trải nghiệm", color: colors.warning},
    {id: 4, name: "Đã sử dụng dịch vụ", color: colors.warning},
    {id: 5, name: "Sử dụng lần đầu", color: colors.warning},
    {id: 6, name: "Thân thiết", color: colors.warning},
  ],
  purifier_status: [
    {id: 1, name: "Cần thay lõi", color: colors.danger},
    {id: 2, name: "Tốt", color: colors.success},
  ],
  contract_status: [
    {id: 1, name: "Hiệu lực", color: colors.success},
    {id: 2, name: "Đã hủy", color: colors.danger},
    {id: 3, name: "Hoàn thành", color: colors.success},
  ],
};

function getData(slug: string) {
  return data[slug] ?? [];
}

function getColor(slug: string, id: number | string) {
  if (_.isString(slug)) {
    if (!data[slug]) {
      return null;
    }
    const find =
      data.order_status.filter((dt: any) => dt.id === Number(id)) ?? [];
    return find[0]?.color;
  }

  return null;
}

function getValue(
  slug: any,
  id: number,
  empty = null,
  options: {key: string; label?: string} = {key: "id", label: "name"}
) {
  if (_.isArray(slug)) {
    let find = slug.find((dt: any) => dt[options.key] === id);

    if (options.label) {
      find = find?.[options.label];
    }

    return find ?? empty;
  }
  if (_.isString(slug)) {
    if (!data[slug]) {
      return empty;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let find = data[slug]?.find((dt: any) => dt[options.key] === id);
    if (options.label) {
      find = find?.[options.label];
    }

    return find ?? empty;
  }

  return empty;
}

export default {
  getValue,
  getData,
  getColor,
  data,
};
