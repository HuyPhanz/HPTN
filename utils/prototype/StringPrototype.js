String.prototype.upperFirstCharacter = function () {
  return charAt(0).toUpperCase() + slice(1);
};

// String.prototype.getUrlQueryObj = function () {
//   return this.slice(1)
//     .split("&")
//     .map((p) => p.split("="))
//     .reduce((obj, [key, value]) => ({ ...obj, [key]: value}), {});
// };
