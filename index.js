const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('body', (request, response) =>{
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }

})

app.get('/info', (request, response)=>{
    const time = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()

})

const generateId = () =>{
    const generatedId = (Math.floor(Math.random()*20000000))%10000000
    return generatedId
}

const personExists = (name) =>{
    const person = persons.find(person => person.name === name)
    if(person){
        return true
    }
    return false
}

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Either name or number is missing or both'
        })
    }

    if(personExists(body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})