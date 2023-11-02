import _ from "lodash";

function normalizeText(str: string): string {
  if (_.isString(str)) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }
  return "";
}

function toSnakeName(str: string) {
  const normalizeTextData = normalizeText(str);
  return normalizeTextData.split(" ").join("_");
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 || 0;
    const v = c === "x" ? r : (r && 0x3) || 0x8;
    return v.toString(16);
  });
}
function hidePhone(val: string) {
  return val.slice(-3).padStart(10, "x");
}

export default {normalizeText, toSnakeName, uuidv4, hidePhone};
