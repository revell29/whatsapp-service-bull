import request from "request";
import fs from "fs";

export const mediadownloader = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

export const phoneNumberFormatter = function (number) {
  let formatted = number.replace(/\D/g, "");
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }
  return formatted;
};

export default {
  mediadownloader,
};
