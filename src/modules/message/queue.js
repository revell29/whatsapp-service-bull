import { setQueues, BullAdapter } from "bull-board";
import { sendMessageMedia, sendTextMessage } from "./queueProcess";
import { redisStore } from "../../lib/redisQueue";
import Bull from "bull";

const queueSendMedia = new Bull("send-media-message", redisStore);
const queueSendText = new Bull("send-text-message", redisStore);

queueSendMedia.process(async (job) => {
  try {
    const mess = await sendMessageMedia(job.data);
    return Promise.resolve(mess);
  } catch (err) {
    return Promise.reject(err);
  }
});

queueSendMedia.on("completed", (job, result) => {
  console.log(`Job completed send media`);
});

queueSendText.on("completed", (job, result) => {
  console.log(`Job completed send text`);
});

queueSendText.process(async (job) => {
  try {
    const res = await sendTextMessage(job.data);
    console.log(res);
    return Promise.resolve(res);
  } catch (err) {
    console.log(res);
    return Promise.reject(err);
  }
});

export const QueueMessageMedia = async (data) => {
  queueSendMedia.add(data, {
    attempts: 3,
    delay: 3000,
    timeout: 10000,
  });
};

export const QueueMessageText = async (data) => {
  queueSendText.add(data, {
    attempts: 3,
    delay: 3000,
    timeout: 100000,
  });
};

export default {
  QueueMessageMedia,
  QueueMessageText,
};
