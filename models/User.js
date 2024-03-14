const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.salt
    delete returnedObject.hash
  }
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

const User = mongoose.model('User', userSchema)

module.exports = User
