const amqplib = require("amqplib");
const { EXCHANGE_NAME, MSG_QUEUE_URL } = require("../../Config");


let channel; 

async function getChannel() {
  if (!channel) {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  }
  return channel;
}

const CreateChannel = async () => {
  const connection = await amqplib.connect(MSG_QUEUE_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  return channel;
};

const PublishMessage = (channel, routingKey, msg) => {
  channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(msg), {
    persistent: true,
  });
};

const SubscribeMessage = async (channel, routingKey, onMessage) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true }); // queue temporaire
  channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        onMessage(msg.content.toString());
      }
    },
    { noAck: true }
  );
};

module.exports = {
  PublishMessage,
  SubscribeMessage,
  getChannel,
};
