import express from 'express'
import mongoose from 'mongoose'
import checkAuth from './middlewares/checkAuth.js'
import * as UserController from './controllers/userController.js'
import { registrationValidation,loginValidation } from './validations.js'
import User from './models/User.js'
const app = express()
mongoose.connect('mongodb+srv://gaunt0066:Panzerkampf06@cluster0.6m4r7dq.mongodb.net/archakov?retryWrites=true&w=majority')
    .then(() => console.log('mongo connected')).catch((error) => console.log(error))
app.use(express.json())
app.post('/auth/registration',registrationValidation, UserController.registration)
app.post('/auth/login', loginValidation, UserController.login)
app.get('/auth/getuser', UserController.getUser)

// app.get('/posts', UserController)
app.listen(3004, (err) => {
    if (err) {
        return res.json(err)
    }
    console.log('server has benn started');

})