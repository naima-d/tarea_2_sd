const { Kafka } = require('kafkajs');
const enviarCorreo = require('./correo');
const { Message } = require('./db');

const kafka = new Kafka({
  clientId: 'entregando-notify-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'entregando-notify-group' });

const entregando = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'entregando' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(`Mensaje entregando: ${message.value.toString()}`);
      
      const data = JSON.parse(message.value.toString());

      try {
        await Message.updateOne({ id: data.id }, { estado: 'entregando' });

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

module.exports = entregando;