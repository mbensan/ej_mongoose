const express = require('express');
const router = express.Router()
const { Articulo } = require('../db.js');


router.get('/', async (req, res) => {
  const articles = await Articulo.find()
  res.json(articles)
})

router.post('/', async (req, res) => {

  const articulo = new Articulo({
    titulo: 'Ejemplo de artículo',
    cuerpo: 'Fiesta en el lago, traigan sus lanchas',
    tags: ['fiesta', 'lanchas', 'redbull']
  })
  await articulo.save()
  console.log('Titulo articulo creado', articulo.titulo);
  res.send(articulo)
});

router.post('/creado_en/:fecha', async (req, res) => {
  const articulos = await Articulo.find({creado_end: req.params.fecha})

  for (articulo of articulos) {
    articulo.titulo = req.body.titulo
    articulo.cuerpo = req.body.cuerpo
    await articulo.save()
  }
  res.send(articulos)
});

router.post('/:id', async (req, res) => {
  const articulo = await Articulo.findById(req.params.id)
  articulo.titulo = req.body.titulo
  articulo.cuerpo = req.body.cuerpo
  await articulo.save()
  res.send(articulo)
});

router.delete('/:id', async (req, res) => {
  await Articulo.deleteOne({_id: req.params.id})
  res.send('OK')
});

router.delete('/titulo/:titulo', async (req, res) => {
  await Articulo.deleteMany({titulo: req.params.titulo})
  res.send('OK')
});


module.exports = router;