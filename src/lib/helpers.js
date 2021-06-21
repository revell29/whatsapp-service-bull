import request from "request";
import fs from "fs";

export const mediadownloader = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

export default {
  mediadownloader,
};
