const { Router } = require('express');
const router = Router();

// Middleware: Verifica si el usuario está logueado.
// en caso de que no, lo mandamos al login
function checkLogin(req, res, next) {
  if (req.session.user == null) {
    return res.redirect('/login');
  }
  res.locals.user = req.session.user;
  /* si llegamos hasta acá, esntonces estamos seguros
   que si existe req.session.user */
  next();
}

router.get('/', checkLogin, async (req, res) => {
  res.render('index.html');
});

router.get('/pwa', async (req, res) => {
  res.render('pwa.html')
})

router.get('/quotes', checkLogin, async (req, res) => {
  res.render('citas.html');
});

module.exports = router;