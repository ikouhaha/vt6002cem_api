

const Koa = require('koa')
const socketIo = require('socket.io');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


require('dotenv').config()

const app = new Koa()

const auth = require('./routes/auth.js')
const products = require('./routes/products.js')
const user = require('./routes/users')
const passport = require('./helpers/passport')
const config = require('./config')


const bodyParser = require('koa-bodyparser')

const static = require('koa-static-router')
const cors = require('@koa/cors');


const options = {
    origin: '*',
}

app.use(cors(options));

// Sessions
app.use(static({ dir: 'docs', router: '/doc/' }))
app.use(bodyParser())
app.use(passport.initialize())
app.use(auth.routes())
app.use(user.routes())
app.use(products.routes())

const port = config.PORT
const host = config.HOST


let server
if (host) {
    server = app.listen(port, host)
} else {
    server = app.listen(port)
}

