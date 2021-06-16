const app = require('express')()
const mongoose = require('mongoose')
const jsonParser = require('body-parser').json()
const multer = require('multer')

// Config
const port = 3000
const URI = 'mongodb+srv://Despicable:Zhengulov1@glass.pljrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const rootEmail = 'despicablegrand@gmail.com'
const upload = multer({dest:"uploads"});

// Models
const Chats = require('./models/Chats.js')
const Orders = require('./models/Orders.js')
const Products = require('./models/Products.js')

// Fields
const ChatsFields = 'userEmail messages isFinished'
const OrdersFields = 'products date userEmail userPhone'
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

// --API--

// Products
// !Нужно довети до ума
app.post('/addProduct', jsonParser, (req, res) => {
  
  let photoPath = '/path'

  Products.create({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    photoPath: photoPath,
    type: req.body.type,
    width: req.body.width,
    height: req.body.height,
    shape: req.body.shape,
    edge: req.body.edge,
    hardening: req.body.hardening,
    facet: req.body.facet,
    cutouts: req.body.cutouts,
    holes: req.body.holes,
    draw: req.body.draw
  })
})
app.get('/getProducts', jsonParser, (req, res) => {
  Products.find({}, ProductsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})
app.post('/getProduct', jsonParser, (req, res) => {
  Products.findOne({_id: req.body._id}, ProductsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})
app.post('/updateProduct', jsonParser, (req, res) => {
  // * путь до фотографии
  Products.findOneAndUpdate(
    {_id: req.body._id}, 
    {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      photoPath: photoPath,
      type: req.body.type,
      width: req.body.width,
      height: req.body.height,
      shape: req.body.shape,
      edge: req.body.edge,
      hardening: req.body.hardening,
      facet: req.body.facet,
      cutouts: req.body.cutouts,
      holes: req.body.holes,
      draw: req.body.draw
    }, 
    {useFindAndModify: false, new: true},
    (err, query) => {
      sendJSON(res, status.ok, query)
    }).catch(err => sendError(res, status.serverError, err))
})

// Order
app.post('/addOrder', jsonParser, (req, res) => {
  Orders.create({
    products: req.body.products,
    date: req.body.date,
    userEmail: req.body.userEmail,
    userPhone: req.body.userPhone
  })
  .then(() => sendJSON(res, status.ok, {added: true}))
  .catch(err => sendError(res, status.ok, err))
})
app.get('/getOrders', (req, res) => {
  Orders.find({}, OrdersFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})
app.post('/getOrder', jsonParser, (req, res) => {
  Orders.findOne({_id: req.body._id}, OrdersFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})
// * /updateOrder

// Chat
app.post('/addChat', jsonParser, (req, res) => {
  Chats.create({
    userEmail: req.body.userEmail,
    messages: [],
    isFinished: false
  })
  .then(() => sendJSON(res, status.ok, {added: true}))
  .catch(err => sendError(res, status.ok, err))
})
app.post('/getChatMessages', jsonParser, (req, res) => {
  Chats.findOne({_id: req.body._id}, messages, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})
app.post('/addMessage', jsonParser, (req, res) => {
  Chats.findOneAndUpdate(
    {_id: req.body._id, isFinished: false}, 
    {$push: {messages: req.body.message}}, 
    {useFindAndModify: false, new: true},
    (err, query) => {
      sendJSON(res, status.created, query)
  }).catch(err => sendErorr(res, status.serverError, query))
})
app.post('/addRootMessage', jsonParser, (req, res) => {
  if(req.body.userEmail == rootEmail) {
    let newMessage = req.body.message
    newMessage.root = true
    Chats.findOneAndUpdate(
      {_id: req.body._id, isFinished: false}, 
      {$push: {messages: newMessage}}, 
      {useFindAndModify: false, new: true},
      (err, query) => {
        sendJSON(res, status.created, query)
    }).catch(err => sendErorr(res, status.serverError, query))
  }
})
app.post('/finishChat', jsonParser, (req, res) => {
  Chats.findOneAndUpdate(
    {_id: req.body._id},
    {isFinished: true},
    (err, query) => {
      sendJSON(res, status.created, query)
    }).catch(err => sendError(res, status.serverError, err))
})

// Tests
app.post("/upload", upload.single("filedata"), function (req, res, next) {
   
  let filedata = req.file;

  console.log(filedata);
  if(!filedata)
      res.send("Ошибка при загрузке файла");
  else
      res.send("Файл загружен");
});

// Not Found
app.use((req, res) => {
  sendError(res, status.notFound, {err: 'Not Found'})
})

// Listening
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});



// --old version
// app.post('/addMessage', jsonParser, (req, res) => {
//   Chats.create({
//     userEmail: req.body.userEmail,
//     message: req.body.message,
//     isUser: req.body.isUser
//   })
//   .then(() => sendJSON(res, status.ok, {added: true}))
//   .catch(err => sendError(res, status.ok, err))
// })