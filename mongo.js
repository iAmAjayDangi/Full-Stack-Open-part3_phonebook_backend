const mongoose = require('mongoose')
const Person = require('./models/person')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://ajay:${password}@phonebook.3d31s3b.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result =>{
        result.forEach(person =>{
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
