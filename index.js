const mg = require('mongoose');

mg.connect(
  'mongodb://localhost:27017/bootcamp_inacap'
  , {
    useNewUrlParser: true
  }
)

mg.connection.on('error', function(e) {
  console.log('Error en la conección a Mongo');
  console.log(e);
})

const TemaSchema = new mg.Schema({
  nombre: { type: String, required: true},
  posicion: { type: Number, required: true, min: 1}
})

const Album = mg.model('Album', mg.Schema({
  titulo: {type: String, required: true},
  artista: {type: String, required: true},
  sello: {type: String, required: true},
  precio: {type: Number, required: true, min: 0},
  lanzamiento: {type: Date, required: true},
  temas: [TemaSchema]
}))


async function solucion () {
  // A: Todas las canciones del album 'Blur'
  const blur = await Album.findOne({title: 'Blur'})
  console.log('Blur Album', blur)

  // B: Un album "homónimo" es aquel en que el nombre  del album es igual al del artista (por ejemplo el album 'Blur' de la banda 'Blur'). Imprime la lista de albumes homónimos..
  const homonimos = await Album.find({
    $expr: {
      $eq: ['$titulo', '$artista']
    }
  })
  console.log('homonimos', homonimos);
  
  // C: Por cada album imprimir su titulo y el número de canciones
  const albumes = await Album.find()
  for (album of albumes) {
    console.log(`El album ${album.title} tiene ${album.temas.length} canciones`);
  }
  
  // D: Por cada album imprimir el título y el número de canciones que contengan la palabra “corazón” (en caso de que no contenga ninguna canción con este criterio, no imprimir el album)
  const albumes_corazon = Album.find({
    temas: {
      $elemMatch: { nombre: {$regex: /corazón/, $options: 'i'}}
    }
  })
  for (album of albumes_corazon) {
    console.log(`El album ${album.title} tiene ${album.temas.length} canciones`);
  }

  // E: Artista que grabó la canción 'Alison'.
  const album_allison = Album.findOne({
    temas: {
      $elemMatch: { nombre: {$eq: 'Allison'}}
    }
  })
  console.log(`El artista se llama ${album.artista}`);
  // F: Lista de canciones que aparecen en más de un album (canciones con mismo nombre), y el número de albumes en que aparece.

}

module.exports = Album