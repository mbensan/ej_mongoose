const mg = require('mongoose');

mg.connect(
  'mongodb://localhost:27017/bootcamp_inacap'
  , {useNewUrlParser: true}
)
mg.connection.on('error', function(e) {
  console.log('Error en la conección a Mongo');
  console.log(e);
})

const User = mg.model('User', new mg.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String},
  created: {type: Date, default: Date.now()},
  role: {type: String, enum: ['admin', 'editor', 'user']},
  type: {type: String, enum: ['google', 'facebook', 'microsoft', 'native'], default: 'native'},
  avatar: {type: String},
  federated_ids: {}
}))

const ComentarioSch = new mg.Schema({
  comentario: { type: String, required: true},
  autor: String
})

const Articulo = mg.model('Articulo', mg.Schema({
  titulo: {type: String, required: true},
  cuerpo: String,
  tags: [String],
  publicado: { type: Boolean, default: false },
  creado_en: { type: Date, default: Date.now },
  comentarios: [ComentarioSch]
}))

const Pelicula = mg.model('Pelicula', mg.Schema({
  titulo: {type: String, required: true},
  sinopsis: String,
  tags: [String],
  duracion: { type: Number, min: 10, required: true},
  portada: String,
  fecha: { type: Date, default: Date.now() }
}))

module.exports = { Articulo, Pelicula, User }
