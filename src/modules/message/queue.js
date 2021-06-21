import { setQueues, BullAdapter } from "bull-board";
import { sendMessageMedia } from "./queueProcess";
import { redisStore } from "../../lib/redisQueue";
import Bull from "bull";

const queue = new Bull("send-message-wa", redisStore);

// setQueues([new BullAdapter(queue)]);

queue.process(async (job) => {
  try {
    const mess = await sendMessageMedia(job.data);
    return Promise.resolve(mess);
  } catch (err) {
    return Promise.reject(err);
  }
});

queue.on("completed", (job, result) => {
  console.log(`Job completed with result ${result}`);
});

export const sendMessage = async (data) => {
  queue.add(data, {
    attempt: 3,
  });
};

export default {
  sendMessage,
};
