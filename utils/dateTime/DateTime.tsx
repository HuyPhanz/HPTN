import moment from "moment";

const _strFormat = {
  "-dmy": "DD-MM-YYYY",
  "-ymd": "YYYY-MM-DD",
  "/dmy": "DD/MM/YYYY",
  "/ymd": "YYYY/MM/DD",

  "-dmy Hms": "DD-MM-YYYY HH:mm:ss",
  "-ymd Hms": "YYYY-MM-DD HH:mm:ss",
  "/dmy Hms": "DD/MM/YYYY HH:mm:ss",
  "/ymd Hms": "YYYY/MM/DD HH:mm:ss",

  "-dmy hms": "DD-MM-YYYY hh:mm:ss",
  "-ymd hms": "YYYY-MM-DD hh:mm:ss",
  "/dmy hms": "DD/MM/YYYY hh:mm:ss",
  "/ymd hms": "YYYY/MM/DD hh:mm:ss",

  "Hms": "HH:mm:ss",
  "hms": "hh:mm:ss",
};

function format(
  input: any,
  inFormat = "-ymd",
  outFormat = "/dmy",
  empty = "Invalid date"
): string {
  try {
    if (typeof input !== "string") {
      return empty;
    }

    if (input === "") {
      return empty;
    }

    if (
      !_strFormat.hasOwnProperty(inFormat) ||
      !_strFormat.hasOwnProperty(outFormat)
    ) {
      return empty;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return moment(input, _strFormat[inFormat]).format(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _strFormat[outFormat]
    );
  } catch (e) {
    return empty;
  }
}

/**
 *
 * @param firstDate
 * @param secondDate
 * @returns {string|boolean}
 */
function compare(firstDate: any, secondDate: any): any {
  return moment(firstDate).diff(moment(secondDate));
}
/**
 *
 * @param input
 * @param inFormat
 * @param now
 * @returns {string|boolean}
 */
function isExpired(input: any, inFormat = "-ymd", now = moment()) {
  if (typeof input !== "string") {
    return false;
  }
  if (input === "") {
    return false;
  }

  if (!_strFormat.hasOwnProperty(inFormat)) {
    return "Invalid format date";
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  input = moment(input, _strFormat[inFormat]);
  input.set("hours", 23);
  input.set("minutes", 59);
  input.set("seconds", 59);

  now.set("hours", 0);
  now.set("minutes", 0);
  now.set("seconds", 0);

  return input.diff(now) < 0;
}
function Time(
  input: any,
  inFormat = "-ymd hms",
  outFormat = "hms",
  empty = "Invalid date"
) {
  try {
    if (typeof input !== "string") {
      return empty;
    }

    if (input === "") {
      return empty;
    }

    if (
      !_strFormat.hasOwnProperty(inFormat) ||
      !_strFormat.hasOwnProperty(outFormat)
    ) {
      return empty;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return moment(input, _strFormat[inFormat]).format(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _strFormat[outFormat]
    );
  } catch (e) {
    return empty;
  }
}

/**
 *
 * @param created
 * @returns {string}
 */
function convertTimeCreated(created: any): any {
  created = moment(created);
  const now = moment();
  const diff = now.diff(created);

  const diffYears = diff / 1000 / 60 / 60 / 24 / 30 / 12;
  if (diffYears > 1) {
    return Math.floor(diffYears) + ` year${diffYears >= 2 ? "s" : ""}`;
  }

  const diffMonths = diffYears * 12;
  if (diffMonths > 1) {
    return Math.floor(diffMonths) + ` month${diffMonths >= 2 ? "s" : ""}`;
  }

  const diffDays = diffMonths * 30;
  if (diffDays > 1) {
    return Math.floor(diffDays) + ` day${diffDays >= 2 ? "s" : ""}`;
  }

  const diffHours = diffDays * 24;
  if (diffHours > 1) {
    return Math.floor(diffHours) + ` hour${diffHours >= 2 ? "s" : ""}`;
  }

  return "a few minutes ago";
}

/**
 *
 * @param month {number}
 * @param year {number}
 * @returns {mumber}
 */

function getDayOnMonth(month: number, year: number): number {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12: {
      return 31;
    }
    case 4:
    case 6:
    case 9:
    case 11: {
      return 30;
    }
    case 2: {
      if (year % 100 !== 0 && year % 4 === 0) return 29;
      return 28;
    }
    default:
      return 31;
  }
}

function formatDate(day: number, month: number, year: number): string {
  const day1 = day < 10 ? "0" + day : day;
  const month1 = month < 10 ? "0" + month : month;
  return month1 + "/" + day1 + "/" + year;
}

function formatDateVN(day: number, month: number, year: number): string {
  const day1 = day < 10 ? "0" + day : day;
  const month1 = month < 10 ? "0" + month : month;
  return day1 + "/" + month1 + "/" + year;
}

function formatDateSever(day: number, month: number, year: number): string {
  const day1 = day < 10 ? "0" + day : day;
  const month1 = month < 10 ? "0" + month : month;
  return year + "-" + month1 + "-" + day1;
}

function checkDay(d1: any, dNow: any): any {
  const date = new Date(d1).getTime();
  const date2 = new Date(dNow).getTime();
  const dateDiff = date2 - date;
  const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  if (days === 1) return "Hôm qua";
  if (days === 0) return " Hôm nay";
  if (days === -1) return "Ngày mai";
  return null;
}

function diffDay(d1: any, dNow: any): any {
  const date = new Date(d1).getTime();
  const date2 = new Date(dNow).getTime();
  const dateDiff = date2 - date;
  const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  return days;
}
function diffTime(d1: any, dNow: any): any {
  const date = new Date(d1).getTime();
  const date2 = new Date(dNow).getTime();
  const dateDiff = date2 - date;
  return dateDiff;
}

function formatNumber(i: number): string {
  if (i < 10) {
    if (i < 0) {
      return "0" + -i;
    }
    return "0" + i;
  }
  return i.toString();
}

function countDownTime(date: any): string {
  const countDownDate = new Date(date).getTime();
  const now = new Date().getTime();

  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

function diffHours(date: any): any {
  const countDownDate = new Date(date).getTime();
  const now = new Date().getTime();
  const distance = countDownDate - now;
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  return hours;
}

export default {
  format,
  compare,
  diffHours,
  countDownTime,
  formatNumber,
  diffTime,
  diffDay,
  isExpired,
  Time,
  checkDay,
  convertTimeCreated,
  getDayOnMonth,
  formatDate,
  formatDateVN,
  formatDateSever,
};
