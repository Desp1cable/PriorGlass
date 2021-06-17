const app = require('express')()
const mongoose = require('mongoose')
const jsonParser = require('body-parser').json()
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
const fs = require('fs')
// const swaggerDocument = require('./swagger.json');

// Config
const port = 3000
const URI = 'mongodb+srv://Despicable:Zhengulov1@glass.pljrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const rootEmail = 'despicablegrand@gmail.com'
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "PriorGlass API",
      description: "PriorGlass API Information",
      contact: {
        name: "Desp1calbe"
      },
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["app.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /getProducts:
 *  get:
 *    description: Use to request all products
 *  responses:
 *    '200':
 *      description: A successful response
 */
app.get('/getProducts', jsonParser, (req, res) => {
  Products.find({}, ProductsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})

/**
 * @swagger
 * /getProduct:
 *  post:
 *    description: Use to request product
 *  parameters:
 *    - _id: _id
 *      in: query
 *      description: _id of our product
 *      required: false
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: A successful response
 */
app.post('/getProduct', jsonParser, (req, res) => {
  Products.findOne({_id: req.body._id}, ProductsFields, (err, query) => {
    sendJSON(res, status.ok, query)
  }).catch(err => sendError(res, status.serverError, err))
})

/**
 * @swagger
 * /updateProduct:
 *  post:
 *    description: Use to update product
 *  parameters:
 *    - name: name
 *      in: query
 *      description: Name of our customer
 *      required: false
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: A successful response
 */
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
// function encode_base64(filename) {
//   fs.readFile(path.join(__dirname, filename), function (error, data) {
//     if (error) {
//       throw error;
//     } else {
//       //console.log(data);
//       var dataBase64 = Buffer.from(data).toString('base64');
//       console.log(dataBase64);
//       client.write(dataBase64);
//     }
//   });
// }
// function base64_decode(base64Image, file) {
//   fs.writeFileSync(file,base64Image);
//    console.log('******** File created from base64 encoded string ********');

// }
// app.post("/upload", jsonParser, (req, res) => {
//   base64_decode(req.body.file, 'copy.jpg')
// });

// Not Found
app.use((req, res) => {
  sendError(res, status.notFound, {err: 'Not Found'})
})

// Listening
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});