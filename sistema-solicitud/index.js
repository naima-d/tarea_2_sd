const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');

const port = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', router);

app.listen(port, () => {
    console.log('Connected to port', port);
});