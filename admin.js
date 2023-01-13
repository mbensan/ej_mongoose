const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')
const { Articulo, Pelicula, User } = require('./db.js')

AdminJS.registerAdapter(AdminJSMongoose)
const express = require('express')
const req = require('express/lib/request')
const app = express()

const adminJs = new AdminJS({
  resources: [Articulo, Pelicula, User],
  rootPath: '/admin',
})

const router = AdminJSExpress.buildRouter(adminJs)

app.use(adminJs.options.rootPath, router)

const PORT = 3001
app.listen(PORT, () => console.log(`AdminJS is under ${PORT}`))