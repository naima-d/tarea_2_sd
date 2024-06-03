const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'finalizado-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'finalizado-group' });
const producer = kafka.producer();

const finalizado = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'entregando' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      console.log(`Received message: ${message.value.toString()}`);

      const data = JSON.parse(message.value.toString());
      
      data.estado = 'finalizado';
      
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
    topic: 'finalizado',
    messages: [{ value: message }],
  });
  console.log('Message with updated state sent to "finalizado" topic\n');
};

module.exports = finalizado;