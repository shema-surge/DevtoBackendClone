const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const {DB_USERNAME,DB_PASSWORD,DB_NAME,NODE_ENV} = process.env

const port = NODE_ENV === "development"? 3500 : process.env.PORT

const mongoUrl = NODE_ENV === "development"? `mongodb://localhost:27017/ei` : `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ed9sx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`


app.use(express.json())
app.use(express.urlencoded({extended:true}))

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});*/

app.use(cors({
  origin:'*'
}))

app.use('/api/users',require('./routes/users'))
app.use('/api/posts',require('./routes/posts'))
app.use('/api/tags/',require('./routes/tags'))
app.use('/api/comments',require('./routes/comments'))

app.get('/',(req,res)=>{
    res.send(`Ei is running on port ${port}`)
})

app.listen(port,()=>{
    console.log(`Server running on PORT: ${port}`)
})

mongoose.connect(mongoUrl).then((connection)=>{
  console.log('Connected to mongo')
}).catch((err)=>{
  console.error(err)
})