const express = require('express')
const bcrypt = require('bcrypt')
const axios = require('axios')
const queryString = require('query-string')
const { User } = require('../db.js')

const stringifiedParams = queryString.stringify({
  client_id: process.env.GOOGLE_AUTH_ID,
  redirect_uri: 'http://localhost:3000/google-auth-redirect',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
console.log({googleLoginUrl});
const router = express.Router()



router.get('/login', (req, res) => {
  const errors = req.flash('errors')
  res.render('login.html', {errors, googleLoginUrl})
});

router.get('/register', (req, res) => {
  const errors = req.flash('errors')
  res.render('register.html', {errors})
});

router.post('/register', async (req, res) => {
  // recuperamos datos del formulario
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const pass_input = req.body.password.trim()
  const pass_confirm = req.body.pass_confirm.trim()
  // validamos que las contraseñas coincidan
  if (pass_input != pass_confirm) {
    req.flash('errors', 'Las contraseñas no coinciden')
    return res.redirect('/register')
  }
  // encriptamos la contraseña
  const salt = bcrypt.genSaltSync()
  const password = bcrypt.hashSync(pass_input, salt)
  // creamos el usuario
  let user;
  try {
    user = await User.create({
      name, email, password
    })
  } catch (error) {
    req.flash('errors', 'Este email ya se encuentra registrado')
    return res.redirect('/register')
  }
  // redirigimos a pantalla principal
  req.session.user = user
  res.redirect('/')
})

router.post('/login', async (req, res) => {
  const email = req.body.email.trim()
  const pass_input = req.body.password.trim()
  // comprobamos que usuario efectivamente exista
  const user = await User.findOne({email})
  if (!user) {
    req.flash('errors', 'Usuario no encontrado o contraseña incorrecta')
    return res.redirect('/login')
  }
  // comprobamos que contraseña ingresada sea la correcta
  if (!bcrypt.compare(pass_input, user.password)) {
    req.flash('errors', 'Usuario no encontrado o contraseña incorrecta')
    return res.redirect('/login')
  }
  // redirigimos a pantalla principal
  req.session.user = user
  res.redirect('/')
});

router.get('/logout', (req, res) => {
  req.session.user = null
  res.locals.user = null
  return res.redirect('/login')
});

async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_AUTH_ID,
      client_secret: process.env.GOOGLE_AUTH_SECRET,
      redirect_uri: 'http://localhost:3000/google-auth-redirect',
      grant_type: 'authorization_code',
      code,
    },
  });
  // console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
}

async function getGoogleUserInfo(access_token) {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  // console.log(data); // { id, email, given_name, family_name }
  return data;
};

router.get('/google-auth-redirect', async (req, res) => {
  if (req.query.error) {
    console.log('error en redirección de google auth', error)
    req.flash('errors', 'Error en autentificación con Google Auth')
    return res.redirect('/login')
  }
  const code = req.query.code

  const token = await getAccessTokenFromCode(code)

  const userInfo = await getGoogleUserInfo(token)

  let user = await User.findOne({email: userInfo.email})
  if (!user) {
    console.log(userInfo);
    user = await User.create({
      name: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.picture,
      type: 'google',
      federated_ids: {
        'google': userInfo.id
      }
    })
  }

  req.session.user = user
  res.redirect('/')
});


module.exports = router
