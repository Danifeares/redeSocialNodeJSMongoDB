import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes'

const dbURI = process.env.DB_URI as string

mongoose.connect(dbURI).then(() => {
  console.log('Database started')
  const app = express()

  app.use(express.json())
  app.use(routes)

  app.listen(process.env.PORT, () => {
    console.log('Server started')
  })

}).catch((error) => {
  console.log(error)
}) 