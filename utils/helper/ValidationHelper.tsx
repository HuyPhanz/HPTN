const isNaN = (value: any) => {
  return value === "NaN";
};

function getEmptyFields(listInput: any[], data: {[x: string]: any}) {
  const emptyFields: any[] = [];
  // eslint-disable-next-line consistent-return
  listInput.forEach((input) => {
    if (input.required && !input.noSendEdit) {
      if (
        (!data[input.key] && data[input.key] !== 0) ||
        data[input.key].length === 0
      ) {
        return emptyFields.push(input.label);
      }
    }
    const validate = data[input.key];
    if (!validate && validate?.substring && validate?.trim().length === 0) {
      return emptyFields.push(input.label);
    }
  });
  return emptyFields;
}

function getMessageEmptyFields(listInput: any[], data: {[x: string]: any}) {
  const emptyFields = getEmptyFields(listInput, data);
  if (emptyFields.length) {
    return emptyFields.join(", ");
  }
  return null;
}

function checkValidate(listInput: {type: any}[], data: {[x: string]: string}) {
  const message: {message: string; description?: string}[] = [];
  Object.keys(data)?.forEach((key, index) => {
    const validate = data[key];
    if (validate) {
      switch (key) {
        case "email":
          if (/^\w+([.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(data[key])) {
            if (validate?.length < 6 || validate?.indexOf("@") > 255) {
              message.push({
                message: "Email phải có độ dài trong khoảng từ 6 tới 255 ký tự",
              });
            }
          } else {
            message.push({
              message: "Email không hợp lệ!",
            });
          }
          break;
        case "companyPhoneNumber":
        case "hotline":
        case "phone":
          if (
            validate?.length < 8 ||
            validate?.length > 15 ||
            !/^(-84|\+84|0[1,2,3,5,7,8,9])\d{0,14}$/.test(validate)
          ) {
            message.push({
              message: "Số điện thoại không hợp lệ!",
            });
          }
          break;
        case "password":
          if (validate?.length < 6) {
            message.push({
              message: "Mật khẩu phải có độ dài tối thiểu 6 ký tự!",
            });
          } else if (validate?.length > 255) {
            message.push({
              message: "Mật khẩu phải có độ dài nhỏ hơn 256 ký tự!",
            });
          } else if (
            !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/.test(
              validate
            )
          ) {
            message.push({
              message:
                "Mật khẩu phải bao gồm ít nhất 1 chữ cái thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!",
            });
          }
          break;
        case "numberCMT":
          // eslint-disable-next-line no-restricted-globals
          if (
            isNaN(+validate) ||
            validate?.length < 9 ||
            validate?.length > 12
          ) {
            message.push({
              message: "Số CMT/CCCD không hợp lệ!",
              description:
                "Số CMT/CCCD phải có độ dài trong khoảng từ 9 tới 12 chữ số",
            });
          }
          break;
        case "price":
        case "rentCost":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (validate % 1000 !== 0) {
            message.push({
              message:
                key === "price"
                  ? "Giá sản phẩm không hợp lệ!"
                  : "Giá thuê sản phẩm không hợp lệ!",
              description: "Vui lòng nhập số chia hết cho 1000",
            });
          }
          break;
        default:
          if (validate?.length > 255) {
            if (listInput[index]?.type !== "textarea") {
              message.push({
                message: "Độ dài tối đa là 255 ký tự!",
                description: `${key}`,
              });
            }
          }
      }
    }
  });
  return message;
}

export default {getMessageEmptyFields, checkValidate};
