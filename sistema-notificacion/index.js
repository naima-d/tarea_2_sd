const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');
const { connectDB } = require('./db');

const recibido = require('./recibidoNotify');
const preparando = require('./preparandoNotify');
const entregando = require('./entregandoNotify');
const finalizado = require('./finalizadoNotify');

const port = 3002;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/notificacion', router);

app.listen(port, async () => {
    console.log('Connected to port', port);
    await recibido();
    await preparando();
    await entregando();
    await finalizado();
    await connectDB();
});