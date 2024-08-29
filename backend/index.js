import express from 'express'
import  dotenv  from 'dotenv'
import { connectWithMongoDb } from './connection.js'
import router from './routes/route.js'

const app = express()
dotenv.config()

app.use(express.json())

connectWithMongoDb(process.env.URI)
.then(() => console.log("DataBase connected successfully"))
.catch((error) => console.log(error))

app.use('/auth', router )


app.listen(process.env.PORT || 8001, () => console.log("server is Running!"))