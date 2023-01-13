const express = require('express');
const router = express.Router()
const { Articulo, Pelicula } = require('../db.js');

// ruta para renderizar el template
router.get('/', async (req, res) => {
  const peliculas = await Pelicula.find()
  res.render('peliculas.html', {peliculas})
})


router.post('/', async (req, res) => {
  const nueva_pelicula = new Pelicula({
    titulo: req.body.titulo,
    duracion: parseInt(req.body.duracion),
    fecha: new Date(req.body.fecha),
    tags: req.body.tags.split(' '),
    portada: req.body.portada
  })
  await nueva_pelicula.save()

  res.redirect('/peliculas')
});



module.exports = router;