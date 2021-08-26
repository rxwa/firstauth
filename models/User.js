const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

// Password min length
const passwordminlength = 6

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Sie müssen eine Emailadresse angeben.'],
    unique: [true, 'Ein Benutzer mit dieser Emailadresse existiert bereits.'],
    lowercase: true,
    validate: [isEmail, 'Bitte geben Sie eine gültige Emailadresse an.']
  },
  password: {
    type: String,
    required: [true, 'Bitte wählen Sie ein Passwort.'],
    minlength: [passwordminlength, 'Das Passwort muss mindestens 6 Zeichen lang sein.']
  }
})

// hashing and salting the password if minlength is given
userSchema.pre('save', async function (next) {
  if(this.password.length >= passwordminlength) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User;