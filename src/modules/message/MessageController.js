import { MessageMedia, Location, MessagAck } from "whatsapp-web.js";
import Vuri from "valid-url";
import fs from "fs";
import * as helpers from "../../lib/helpers";
import * as messageQueue from "./queue";
import Promise from "bluebird";

class MessageController {
  /**
   *  Send MEssage with image
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async sendMessageImage(req, res) {
    try {
      const { phone, image, caption } = req.body;

      if (phone == undefined || image == undefined) {
        return res.status(400).send({
          status: "error",
          message: "please enter valid phone and base64/url of image",
        });
      }

      if (!Vuri.isWebUri(image)) {
        return res.status(400).send({ message: "Invalid image format." });
      }

      if (!fs.existsSync("./temp")) {
        await fs.mkdirSync("./temp");
      }

      var path = "./temp/" + image.split("/").slice(-1)[0];
      helpers.mediadownloader(image, path, async () => {
        await messageQueue.sendMessage({
          phone: phone,
          caption: caption,
          path: path,
        });
      });

      return res.status(200).send({ message: "berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { phone, message } = req.body;
      if (phone == undefined || message == undefined) {
        return res.status(400).send({
          status: "error",
          message: "please enter valid phone and message",
        });
      }

      const res = await client.sendMessage(phone + "@c.us", message);

      return res.status(200).send({
        status: "success",
        message: `Message successfully sent to ${phone}`,
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }
}

export default new MessageController();
