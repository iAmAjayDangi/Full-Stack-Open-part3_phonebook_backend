const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url).then(result =>{
    console.log('connected to MongoDB')
}).catch(error =>{
    console.log('error connecting to MongoDB: ', error.message)
})

const validatePhoneNumber = (value) =>{
    console.log(value)
    const re1 = /^([0-9]{3})[-]([0-9]*)$/
    const re2 = /^([0-9]{2})[-]([0-9]*)$/
    return re1.test(value) || re2.test(value)
} 

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: validatePhoneNumber
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)