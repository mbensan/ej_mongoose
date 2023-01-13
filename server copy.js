const express=require("express");
const nunjucks=require("nunjucks");
const usuarios = require('./db.js')
const session = require('express-session');
const flash = require('connect-flash');
const app=express();

// se configuran estáticos
app.use('/static', express.static("static"))

// Se configura manejo de formularios
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
// se configura uso de sesiones
app.use(session({secret: 'mipropiaclave'})); 
app.use(flash()) 

// se configura nunjucks
nunjucks.configure('templates' ,{
  express:app,
  autoscape:true,
  noCache:false,
  watch:true
}); 

app.use('/articulos', require('./routes/articulos.js'))


app.get("/",(req,res)=>{
  console.log(req.session.usuario);
  res.locals.usuario = req.session.usuario
  res.render('index.html');
});

app.get('/actores', (req, res) =>{
  res.render('actores.html')
})

app.get('/contact', (req, res) => {
  res.render('contact.html')
});

app.get('/login', (req, res) => {
  const errors = req.flash('errors')
  res.render('login.html', {errors})
});

app.post('/login', (req, res) => {
  // primero recuperamos los campos email y password
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  // validamos que los campos existan
  if (!email || !password) {
    req.flash('errors', 'Falta alguno de los campos')
    return res.redirect('/login')
  }
  // validamos que el usuario con ese email exista
  const usuario = usuarios.find(u => u.email == email);
  if (!usuario) {
    req.flash('errors', 'Usuario inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  // validamos que las contraseñas coincidan
  if (usuario.pass != password) {
    req.flash('errors', 'Usuario inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  // Si todo está OK, entonces guardamos el usuario en sesión,
  // y redirigimos al Home.
  req.session.usuario = usuario;
  res.redirect('/')
});

app.get('/logout', (req, res) => {
  req.session.usuario = null;
  res.locals.usuario = null;
  res.redirect('/login')
})

app.listen(3000,()=>{
  console.log("express server running on ", 3000)
})