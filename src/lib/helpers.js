import request from "request";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';


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

export function generateShortUID() {
  const buffer = [];
  let id = uuidv4(null, buffer);

  const b = Buffer.from(id).toString('Base64');
  id = b.substr(0, b.length - 2);
  id = id.replace(/\+/g, 'a');
  id = id.replace(/\//g, 'b');
  return id.toLowerCase();
}

export const generateNewImage = (image) => {
  let sliceImage = image.split("/").slice(-1)[0];
  let popImage = `${generateShortUID()}.${sliceImage.split(".").pop()}`;

  return popImage;
}

export default {
  mediadownloader,
  generateShortUID,
  phoneNumberFormatter,
  generateNewImage
};
