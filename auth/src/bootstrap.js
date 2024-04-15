import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth',
  brokers: ['kafkaBroker1:9092', 'kafkaBroker2:9092']
});

const producer = kafka.producer();

const publishMetadata = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'microfrontendMetadata',
      messages: [{ value: JSON.stringify({ name: 'auth', script: 'http://localhost:8082/remoteEntry.js' }) }],
      
    });
    console.log('Metadata published successfully');
  } catch (error) {
    console.error('Error publishing metadata:', error);
  } finally {
    await producer.disconnect();
  }
};

publishMetadata();
