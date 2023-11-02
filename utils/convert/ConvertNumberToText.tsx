import {isNumber, addSeperator} from "./NumberToText";

const base = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
];
const baseTen = [
  "mười",
  "hai mươi",
  "ba mươi",
  "bốn mươi",
  "năm mươi",
  "sáu mươi",
  "bảy mươi",
  "tám mươi",
  "chín mươi",
];

const baseHundred = [
  "không trăm",
  "một trăm",
  "hai trăm",
  "ba trăm",
  "bốn trăm",
  "năm trăm",
  "sáu trăm",
  "bảy trăm",
  "tám trăm",
  "chín trăm",
];

const getTen = (number: any) => {
  const array = `${number}`.split("");
  const first = parseInt(array[0], 10);
  const second = parseInt(array[1], 10);
  if (second === 0) {
    return baseTen[first - 1];
  }
  if (second === 5) {
    return `${baseTen[first - 1]} lăm`;
  }
  if (second === 4) {
    return `${baseTen[first - 1]} tư`;
  }
  if (second === 1) {
    if (first === 1) {
      return `${baseTen[first - 1]} một`;
    }
    return `${baseTen[first - 1]} mốt`;
  }

  return `${baseTen[first - 1]} ${base[second]}`;
};

const getHundred = (number: any) => {
  const array = `${number}`.split("");
  const first = parseInt(array[0], 10);
  const second = parseInt(array[1], 10);
  const third = parseInt(array[2], 10);
  if (second > 0) {
    return `${baseHundred[first]} ${getTen(`${second}${third}`)}`;
  }
  if (third === 0) {
    return `${baseHundred[first]}`;
  }
  if (third === 4) {
    return `${baseHundred[first]} linh tư`;
  }
  return `${baseHundred[first]} linh ${base[third]}`;
};

const getThousand = (number: any) => {
  const reverseArray = `${number}`.split("").reverse();

  const afterNumber = reverseArray.slice(0, 3).reverse().join("");

  const beforeNumber = parseInt(
    reverseArray.slice(3, reverseArray.length).reverse().join(""),
    10
  );

  const beforeLength = `${beforeNumber}`.length;

  let afterText = "";

  if (parseInt(afterNumber, 10) >= 1) {
    afterText = getHundred(afterNumber);
  }

  if (beforeLength === 1) {
    return `${base[beforeNumber]} nghìn ${afterText}`;
  }

  if (beforeLength === 2) {
    return `${getTen(beforeNumber)} nghìn ${afterText}`;
  }
  return `${getHundred(beforeNumber)} nghìn ${afterText}`;
};

const getMillion = (number: any) => {
  const reverseArray = `${number}`.split("").reverse();
  const afterNumber = reverseArray.slice(0, 6).reverse().join("");
  const beforeNumber = parseInt(
    reverseArray.slice(6, reverseArray.length).reverse().join(""),
    10
  );
  const beforeLength = `${beforeNumber}`.length;

  let afterText = "";
  if (parseInt(afterNumber, 10) > 999) {
    afterText = getThousand(afterNumber);
  } else if (
    parseInt(afterNumber, 10) <= 999 &&
    parseInt(afterNumber, 10) >= 1
  ) {
    afterText = getHundred(`${afterNumber}`.split("").slice(3, 6).join(""));
  }

  if (beforeLength === 1) {
    return `${base[beforeNumber]} triệu ${afterText}`;
  }

  if (beforeLength === 2) {
    return `${getTen(beforeNumber)} triệu ${afterText}`;
  }

  return `${getHundred(beforeNumber)} triệu ${afterText}`;
};

const getBillion = (number: any): any => {
  const reverseArray = `${number}`.split("").reverse();

  const afterNumber = reverseArray.slice(0, 9).reverse().join("");

  const beforeNumber = parseInt(
    reverseArray.slice(9, reverseArray.length).reverse().join(""),
    10
  );

  let afterText = "";
  if (
    parseInt(afterNumber, 10) > 999999 &&
    parseInt(afterNumber, 10) <= 999999999
  ) {
    afterText = getMillion(afterNumber);
  } else if (
    parseInt(afterNumber, 10) <= 999999 &&
    parseInt(afterNumber, 10) > 999
  ) {
    afterText = getThousand(`${afterNumber}`.split("").slice(3, 9).join(""));
  } else if (
    parseInt(afterNumber, 10) <= 999 &&
    parseInt(afterNumber, 10) >= 1
  ) {
    afterText = getHundred(`${afterNumber}`.split("").slice(6, 9).join(""));
  }

  const beforeLength = `${beforeNumber}`.length;
  if (beforeLength === 1) {
    return `${base[beforeNumber]} tỷ ${afterText}`;
  }

  if (beforeLength === 2) {
    return `${getTen(beforeNumber)} tỷ ${afterText}`;
  }

  if (beforeLength === 3) {
    return `${getHundred(beforeNumber)} tỷ ${afterText}`;
  }

  if (beforeLength > 3 && beforeLength <= 6) {
    return `${getThousand(beforeNumber)} tỷ ${afterText}`;
  }

  if (beforeLength > 6 && beforeLength <= 9) {
    return `${getMillion(beforeNumber)} tỷ ${afterText}`;
  }
  return "";
};

function getText(number: any, seperator = ""): string | undefined {
  try {
    if (!isNumber(number)) {
      throw new Error("Input is not a number");
    }

    if (Math.abs(number) > 9007199254740992) {
      throw new Error("Your number is too big");
    }

    if (number < 0) {
      return `âm ${getText(Math.abs(number))}`;
    }

    const {length} = `${number}`;

    let result;

    if (length === 1) {
      result = base[number];
    }
    if (length === 2) {
      result = getTen(number);
    }
    if (length === 3) {
      result = getHundred(number);
    }
    if (length > 3 && length <= 6) {
      result = getThousand(number);
    }
    if (length > 6 && length <= 9) {
      result = getMillion(number);
    }
    if (length > 9) {
      result = getBillion(number);
    }
    if (seperator) {
      return addSeperator(result, seperator);
    }
    return result;
  } catch (error) {
    return "";
  }
}

export default {getText};
