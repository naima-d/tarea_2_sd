const { Kafka } = require('kafkajs');
const { Message } = require('./db');
const enviarCorreo = require('./correo');

const kafka = new Kafka({
  clientId: 'recibido-notify-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'recibido-notify-group' });

const recibido = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'recibido' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(`Mensaje recibido: ${message.value.toString()}`);
      
      const data = JSON.parse(message.value.toString());

      //agregar a base de datos
      try {
        const messageData = { ...data, _id: data.id };
        await Message.create(messageData);
        console.log('Mensaje agregado a la base de datos');
      } catch (error) {
        console.error('Error al agregar el mensaje a la base de datos:', error);
      }
      
      //notificar mediante correo
      const destinatario = data.correo;
      const asunto = "Estado pedido: " + data.estado;
      const cuerpo = `DETALLES PEDIDO:\n\n${JSON.stringify(data, null, 2)}`;
      await enviarCorreo(destinatario, asunto, cuerpo);
    },
  });
};

module.exports = recibido;
