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
  console.log(`Job completed with result ${result}`);
});

queueSendText.process(async (job) => {
  try {
    const res = await sendTextMessage(job.data);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
});

export const QueueMessageMedia = async (data) => {
  queueSendMedia.add(data, {
    attempts: 3,
  });
};

export const QueueMessageText = async (data) => {
  queueSendText.add(data, {
    attempts: 3,
  });
};

export default {
  QueueMessageMedia,
  QueueMessageText,
};
