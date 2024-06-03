const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/estado', controller.getEstado);

module.exports = router;