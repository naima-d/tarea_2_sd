const { Kafka } = require('kafkajs');
const enviarCorreo = require('./correo');
const { Message } = require('./db');

const kafka = new Kafka({
  clientId: 'preparando-notify-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'preparando-notify-group' });

const preparando = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'preparando' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(`Mensaje preparando: ${message.value.toString()}`);
      
      const data = JSON.parse(message.value.toString());

      //actualizar estado en base de datos
      try {
        await Message.updateOne({ id: data.id }, { estado: 'preparando' });

        console.log('Estado actualizado en la base de datos');
      } catch (error) {
        console.error('Error al actualizar el estado en la base de datos:', error);
      }

      //notificar mediante correo
      const destinatario = data.correo;
      const asunto = "Estado pedido: " + data.estado;
      const cuerpo = `DETALLES PEDIDO:\n\n${JSON.stringify(data, null, 2)}`;
      await enviarCorreo(destinatario, asunto, cuerpo);

    },
  });
};

module.exports = preparando;