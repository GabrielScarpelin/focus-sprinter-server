const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { Usuario } = require('./models/Users')
const { Sequelize } = require('sequelize')



app.use(express.urlencoded({extended: true}))
app.use(express.json())

function validPassword(password){
    if (password.length > 7) return true
    return false
}

app.post('/signin', async (req, res, next)=>{
    const user = await Usuario.findOne({ where: {
        email: req.body.email
    } })
    if (user && req.body.email && req.body.senha && req.body.nome){
        if (user.email === req.body.email && user.senha === req.body.senha){
            token = jwt.sign({ email: user.email, nome: user.nome }, process.env.PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 21600
            })
            return res.json({
                token,
                Authenticate: true
            })
        }
        return res.json({
            Authenticate: false,
            erro: "PasswordWrong"
        })
    }
    return res.json({
        Authenticate: false,
        erro: "NotFound"
    })
})
app.post('/signup', async (req, res)=>{
    const checkUser = await Usuario.findAll({
        where: {
            email: req.body.email
        }
    })
    if (checkUser.length === 0){
        if (!validPassword(req.body.senha)) return res.json({
            created: false,
            erro: "InvalidPassword"
        })
        const newUser = await Usuario.create({
            email: req.body.email,
            senha: req.body.senha,
            nome: req.body.nome
        })
        if (newUser){
            const token = jwt.sign({ email: newUser.email, nome: newUser.nome }, process.env.PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 21600
            })
            return res.json({
                token,
                created: true
            })
        }
        return res.json({
            erro: "ErroCriar",
            created: false
        })
    }
    return res.json({
        erro: "DuplicatedUser",
        created: false
    })
})

app.use((req, res, next)=>{
    const token = req.headers['authorization']
    jwt.verify(token, process.env.PUBLIC_KEY, {algorithms: ['RS256']}, (err, decoded) => {
        if (err){
            res.json({validToken: false, error: err}).status(401)
        }
        else {
            next()
        }
    })
})

app.get('/', (req, res, next)=>{
    res.json("Protected route, but the user have access")
})

app.listen(3000)