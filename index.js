require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

morgan.token('body', (request, response) =>{
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next)=>{
    Person.find({}).then(result =>{
        response.json(result)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next)=>{
    
    Person.findById(request.params.id).then(person =>{
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    }).catch(error =>{
        next(error)
    })

})

app.get('/info', (request, response, next)=>{
    const time = new Date()

    Person.count({}).then(count =>{
        response.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)=>{
    Person.findByIdAndRemove(request.params.id).then(result =>{
        response.status(204).end()
    }).catch(error =>{
        next(error)
    })

})

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Either name or number is missing or both'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })

})

app.put('/api/persons/:id', (request, response, next)=> {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true}).then(updatedPerson =>{
        response.json(updatedPerson)
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error : 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})