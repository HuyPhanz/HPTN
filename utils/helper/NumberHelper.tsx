import _ from "lodash";

function getMoneyFormat(number: number, n: any, x: any) {
  if (!_.isNumber(number)) {
    number = parseInt(number, 10);
  }
  const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
  // eslint-disable-next-line no-bitwise
  return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
}

export default {getMoneyFormat};
