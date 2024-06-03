const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'recibido-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'recibido-group' });
const producer = kafka.producer();

const recibido = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'requests' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      console.log(`Received message: ${message.value.toString()}`);

      const data = JSON.parse(message.value.toString());
      
      data.estado = 'recibido';
      
      const updatedMessage = JSON.stringify(data);
      
      const delay = 5000;

      setTimeout(async () => {
        await produceMessage(updatedMessage);
      }, delay);
    },
  });
};

const produceMessage = async (message) => {
  await producer.connect();
  await producer.send({
    topic: 'recibido',
    messages: [{ value: message }],
  });
  console.log('Message with updated state sent to "recibido" topic\n');
};

module.exports = recibido;