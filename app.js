const express = require('express')
const app = express()
const port = 1234
const path = require('path')
const indexRouter = require('./routers/index')
const usersRouter = require('./routers/users')
const productsRouter = require('./routers/products')
const apiRouter = require('./routers/api')
const categoriesRouter = require("./routers/categories")
const ordersRouter = require('./routers/orders');
const bodyParser = require('body-parser');
const cors = require('cors')


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static('public'))

app.use('/',indexRouter)
app.use('/users',usersRouter)
app.use('/products',productsRouter)
app.use('/api',apiRouter)
app.use('/categories',categoriesRouter)
app.use('/orders', ordersRouter);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

