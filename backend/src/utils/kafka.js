// src/utils/kafka.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId:'realtime-db', brokers:['localhost:9092'] });
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId:'ws-router' });

export async function initKafka() {
  await producer.connect();
  await consumer.connect();

  // Admin: create topic if it doesn’t exist
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: 'db-change', numPartitions: 1, replicationFactor: 1 }],
    waitForLeaders: true,    // wait until a leader is elected
  });
  await admin.disconnect();
}
