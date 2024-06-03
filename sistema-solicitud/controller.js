const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();

const createTopics = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: 'requests', numPartitions: 3 },
      { topic: 'recibido', numPartitions: 3 },
      { topic: 'preparando', numPartitions: 3 },
      { topic: 'entregando', numPartitions: 3 },
      { topic: 'finalizado', numPartitions: 3 }
    ]
  });
  await admin.disconnect();
};

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

connectProducer().catch(console.error);

const createRequest = async (req, res) => {
  const orderData = req.body;
  const orderId = uuidv4();

  try {
    await producer.send({
      topic: 'requests',
      messages: [
        { key: orderId, value: JSON.stringify({ id: orderId, ...orderData }) },
      ],
    });
    res.status(200).json({ message: 'Order request sent successfully', id: orderId });
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    res.status(500).json({ message: 'Failed to send order request', error: error.message });
  }
};

module.exports = {
  createRequest,
  createTopics // Exportamos la función para crear los topics
};