// Topic 'payment-done' now has 3 partitions

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
})

const consumer = kafka.consumer({ groupId: "my-app3" });

async function main() {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "payment-done", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message?.value?.toString()
      })
    },
  })
}

main();