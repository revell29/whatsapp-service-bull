import express from "express";
import fs from "fs";
import axios from "axios";

import routesApi from "./modules";
import authModule from "./modules/auth";

const bodyParser = require("body-parser");
const config = require("../config.json");
const { Client, MessageAck } = require("whatsapp-web.js");
const SESSION_FILE_PATH = "./session.json";

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require("../session.json");
}

process.title = "whatsapp-node-api";
global.client = new Client({
  puppeteer: {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--unhandled-rejections=strict",
    ],
  },
  session: sessionCfg,
});

global.authed = false;

const app = express();

const port = process.env.PORT || config.port;
//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.on("qr", (qr) => {
  fs.writeFileSync("./last.qr", qr);
});

client.on("authenticated", (session) => {
  console.log("AUTH!");
  sessionCfg = session;

  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
    authed = true;
  });

  if (fs.existsSync("./last.qr")) {
    fs.unlinkSync("./last.qr");
  }
});

client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  sessionCfg = "";
  process.exit();
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// client.on("message_ack", (msg, ack) => {
//   if (msg.ack === MessageAck.ACK_DEVICE) {
//     console.log("terkirim");
//   }
// });

client.on("message", (msg) => {
  if (config.webhook.enabled) {
    axios.post(config.webhook.path, { msg });
  }
});
client.initialize();

app.use("/auth", authModule);
app.use("/api", routesApi);
app.use("/*", (req, res) => {
  res.send({
    message: "Not found!",
  });
});

app.listen(port, () => {
  console.log("Server Running Live on Port : " + port);
});
