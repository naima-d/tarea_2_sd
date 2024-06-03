const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const recibido = require('./recibido');
const preparando = require('./preparando');
const entregando = require('./entregando');
const finalizado = require('./finalizado');

const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.listen(port, async () => {
    console.log('Connected to port', port);
    await recibido();
    await preparando();
    await entregando();
    await finalizado();
    console.log('Consumers started successfully');
});