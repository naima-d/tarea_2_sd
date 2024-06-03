const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://user:password@localhost:27017/messagesDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin"
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  Name: String,
  School: String,
  "Job Description": String,
  Department: String,
  Earnings: Number,
  Year: String,
  correo: String,
  estado: String,
  YEAR: String,
  MONTH: String,
  SUPPLIER: String,
  "ITEM CODE": String,
  "ITEM DESCRIPTION": String,
  "ITEM TYPE": String,
  "RETAIL SALES": Number,
  "RETAIL TRANSFERS": Number,
  "WAREHOUSE SALES": Number,
});

// Usa un middleware `pre` para asignar el valor de `id` a `_id`
messageSchema.pre('validate', function (next) {
  if (!this._id) {
    this._id = this.id;
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { connectDB, Message };