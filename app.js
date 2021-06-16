const app = require('express')()
const mongoose = require('mongoose')
const jsonParser = require('body-parser').json()

// Config
const port = 3000
const URI = 'mongodb+srv://Despicable:Zhengulov1@glass.pljrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// Models
const Chats = require('./models/Chats.js')
const Orders = require('./models/Orders.js')
const Products = require('./models/Products.js')

// Fields
const ChatsFields = 'userEmail message isUser'
const OrdersFields = 'userId products date'
const ProductsFields = 'name category price photoPath height shape Edge Hardening facet cutouts Holes Draw'

// Functions
sendJSON = (res, status, data) => {
  res.status(status)
  res.json(data)
  console.log(data)
}
sendError = (res, status, err) => {
  res.status(status)
  res.json(err)
  console.error(err)
}

// statuses
const status = {
  ok: 200,
  created: 201,
  badRequest: 400,
  invalidBody: 400.6,
  logonFailed: 401.1,
  notFound: 404,
  serverError: 500
}

// Connection
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result => console.log('connected to db')))
  .catch(err => console.error(err))

// API

// GET all
app.get('/getProducts', jsonParser, (req, res) => {
  Products.find({}, ProductsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})

app.post('/getChatMessages', jsonParser, async (req, res) => {
  Chats.find({userEmail: req.body.userEmail}, ChatsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})

app.get('/getOrders', jsonParser, (req, res) => {
  Orders.find({}, OrdersFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})

// GET one
// app.post('/getUser', jsonParser, (req, res) => {
//   Users.findOne({_id: req.body._id}, UsersFields, (err, query) => {
//     console.log(query._id)
//     sendJSON(res, status.ok, query)
//   }).catch(err => sendError(res, status.serverError, err))
// })

// // Add
// app.post('/addUser', jsonParser, (req, res) => {
//   Users.create({
//     email: req.body.email,
//     phone: req.body.phone
//   })
//   .then(data => sendJSON(res, status.created, data))
//   .catch(err => sendError(res, status.invalidBody, err))
// })

app.post('/addMessage', jsonParser, (req, res) => {
  Chats.create({
    userEmail: req.body.userEmail,
    message: req.body.message,
    isUser: req.body.isUser
  })
  .then(() => sendJSON(res, status.ok, {added: true}))
  .catch(err => sendError(res, status.ok, err))
})

// app.post('/addMessage', jsonParser, (req, res) => {
//   Chats.findOneAndUpdate(
//     {userEmail: req.body.userEmail}, 
//     {$push: {messages: req.body.message}}, 
//     (err, query) => {
//       sendJSON(res, status.created, query)
//   }).catch(err => sendErorr(res, status.serverError, query))
// })

// Not Found
app.use((req, res) => {
  sendError(res, status.notFound, {err: 'Not Found'})
})

// Listening
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});