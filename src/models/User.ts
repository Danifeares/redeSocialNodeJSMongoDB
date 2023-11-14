import { Schema, model } from 'mongoose'

const User = new Schema({
  name: String,
  email: String,
  username: String,
  photo: String,
  description: String,
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date
})

export default model('User', User)