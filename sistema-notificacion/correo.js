const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "email.prueba.t2@gmail.com",
    pass: "cxxl ynfw hnzd nhxc",
  },
});

const enviarCorreo = async (destinatario, asunto, cuerpo) => {
  try {
    // Obtener la hora actual
    const ahora = new Date();
    // Formatear la hora actual como una cadena legible
    const horaEnvio = ahora.toLocaleString();

    // Añadir la hora de envío al cuerpo del correo
    const cuerpoConHora = `${cuerpo}\n\nHora de envío: ${horaEnvio}`;

    const info = await transporter.sendMail({
      from: '"BUM" <email.prueba.t2@gmail>', // Remitente
      to: destinatario, // Destinatario
      subject: asunto, // Asunto del correo
      text: cuerpoConHora, // Cuerpo del correo en texto plano
    });
    console.log('Correo enviado exitosamente\n');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = enviarCorreo;
