import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import { registrationValidation } from './validations/auth.js'
import UserModel from './models/User.model.js'
import bcrypt from 'bcrypt'
import checkAuth from './middlewares/checkAuth.js'
const app = express()
mongoose.connect('mongodb+srv://gaunt0066:Panzerkampf06@cluster0.6m4r7dq.mongodb.net/archakov?retryWrites=true&w=majority')
    .then(() => console.log('mongo connected')).catch((error) => console.log(error))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hellol')
})
app.post('/auth/registration/', registrationValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const { email, fullName, avatarUrl, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = new UserModel({
            email, fullName, avatarUrl, hashedPassword
        })

        const user = await userData.save()
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '2d'
        })

        res.json({ ...user._doc, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'couldnt regi' })
    }
})

app.post('/auth/login',  async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: "пользователь неee найден" })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.hashedPassword)
        if (!isValidPass) {
            return res.status(404).json({ message: 'неправильный логин или пароль' })
        }
        const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '2d' })
        res.json({ user, token })
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'не удалось авторизоваться' })
    }
})
app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "пользователь не найден"
            })
        }
 res.json(user)
    } catch (error) {
        return
    }
})

app.listen(3004, (err) => {
    if (err) {
        return console.log(err);

    }
    console.log('server has benn started');

})