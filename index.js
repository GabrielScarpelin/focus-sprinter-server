const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/signin', (req, res, next)=>{
    res.send("Fazer login")
})
app.post('/signup', (req, res)=>{
    res.send("Fazer cadastro")
})

app.use((req, res, next)=>{
    const token = req.headers['authorization']
    jwt.verify(token, process.env.SECRET_KEY, {algorithms: ['RS256']}, (err, decoded) => {
        if (err){
            res.json({validToken: false, error: err}).status(401)
        }
        else {
            next()
        }
    })
})

app.listen(3000)