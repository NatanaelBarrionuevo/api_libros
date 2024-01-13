const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const LibroEsquema = new mongoose.Schema({    
  codigo: Number,
  titulo: String,
  autor: String,
  activo: Boolean   
}, {collection: 'libros'});

const Libro = mongoose.model('Libro', LibroEsquema);

module.exports = Libro;