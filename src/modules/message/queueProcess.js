import { MessageMedia, Location, MessageAck } from "whatsapp-web.js";
import fs from "fs";

export const sendMessageMedia = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { phone, caption, path } = job;
    let media = MessageMedia.fromFilePath(path);
    client
      .sendMessage(`${phone}@c.us`, media, {
        caption: caption || "",
      })
      .then((res) => {
        if (res.id.fromMe) {
          fs.unlinkSync(path);
          return resolve(res);
        }
      });
  });
};

export const sendTextMessage = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { phone, message } = job;
    return await client.sendMessage(phone + "@c.us", message);
  });
};

export default {
  sendMessageMedia,
};
