import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import User from './model/User.js'

dotenv.config()

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const PORT = process.env.PORT || 3000
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.jw53i9z.mongodb.net/ACESSOJWT`).then(()=>{
    console.log(`Conectado ao banco de dados`)
}).catch((err)=>{
    console.log(err.message)
}) //outra forma de realizar o acesso




const app = express()
app.use(express.json())

// Open route/ rota publica para qualquer pessoa
app.get("/", (req, res)=>{
    res.status(200).json({msg: "Bem vindo a nossa API"})
})

// Registro de usuario
app.post("/auth/register", async (req, res)=>{
    const {name, email, password, confirmPassword} = req.body

    // Valiações
    if (!name) {
        res.status(422).json({msg: "O nome é obrigatório"}) // 422 quando o servidor entende mas os dados nao estao corretos
    } 
    if (!email) {
        res.status(422).json({msg: "O email é obrigatório"}) // 422 quando o servidor entende mas os dados nao estao corretos
    } 
    if (!password) {
        res.status(422).json({msg: "O password é obrigatório"}) // 422 quando o servidor entende mas os dados nao estao corretos
    } 
    
    if (password != confirmPassword) {
        res.status(422).json({msg: "As senhas não conferem"})
    } 

    // Verificar se o usuario existe
    const userExists = await User.findOne({email: email})

    if (userExists) {
        res.status(422).json({msg: "Esse email já foi cadastrado"})
    }

    // create password
    //bcrypt tambem usa funcoes assincronas
    const salt = await bcrypt.genSalt(12)

    const passwordHash = await bcrypt.hash(password, salt)

    // create user

    const user = new User({
        name: name,
        email: email,
        password: passwordHash
    })

    try {
        await user.save()
        // 201 algo foi criado com sucesso
        res.status(201).json({msg: "Usuario salvo com sucesso"})
    } catch(err){
        res.status(500).json({msg: err.message})
    }

})

app.post("/auth/user", async (req, res)=>{
    const {name, password} = req.body

    if (!name) {
        
    }

})


app.listen(PORT, ()=>{
    console.log(`Servidor escutando em http://localhost:${PORT}`)
})