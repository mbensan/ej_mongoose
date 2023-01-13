const express=require("express")
const nunjucks=require("nunjucks")
const dotenv = require('dotenv')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)

const app = express()
dotenv.config()

// se configuran estáticos
app.use('/static', express.static("static"))

// Se configura manejo de formularios
app.use( express.json() )
app.use( express.urlencoded({ extended: true }) )


// se configura uso de mongodb para sesiones
const store = MongoDBStore({
  uri: 'mongodb://localhost:27017/bootcamp_inacap',
  collection: 'sessions'
})
store.on('error', error => console.log(error))

// se configura uso de sesiones
app.use(session({
  secret: 'mipropiaclave',
  resave: true,
  saveUninitialized: true,
  store
})) 
app.use(flash()) 

// se configura nunjucks
nunjucks.configure('templates' ,{
  express:app,
  autoscape:true,
  noCache:false,
  watch:true
}); 

app.use(require('./routes/auth.js'))
app.use(require('./routes/protected.js'))


app.listen(3000,()=>{
  console.log("express server running on ", 3000)
})