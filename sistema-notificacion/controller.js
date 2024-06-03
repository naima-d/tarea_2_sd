const { Message } = require('./db');

exports.getEstado = async (req, res) => {
  const id = req.query.id;
  try {
    const message = await Message.findOne({ id });
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
