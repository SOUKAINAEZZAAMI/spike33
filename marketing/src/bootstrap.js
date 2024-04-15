import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'marketing',
  brokers: ['kafkaBroker1:9092', 'kafkaBroker2:9092']
});

const producer = kafka.producer();

const publishMetadata = async () => {
  try {
    await producer.connect();
    const metadata = { name: 'marketing', script: 'http://localhost:8081/remoteEntry.js' };
    console.log('Contenu JSON à envoyer :', JSON.stringify(metadata));
    await producer.send({
      topic: 'microfrontendMetadata',
      messages: [{ value: JSON.stringify(metadata) }],
    });
    console.log('Metadata publiées avec succès');
  } catch (error) {
    console.error('Erreur lors de la publication des métadonnées :', error);
  } finally {
    await producer.disconnect();
  }
};

publishMetadata();
