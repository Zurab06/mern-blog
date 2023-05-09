
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.model'
import { registrationValidation } from '../validations/auth.js'

module.exports.userController = {
    registration: async (req, res) => {

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
                expiresIn: '20d'
            })

            res.json({ ...user._doc, token })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'couldnt regi' })
        }


    },
    login: async (req, res) => {
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
    },
    getUser: async (req, res) => {

        try {
            const user = await UserModel.findById(req.userId)
            if (!user) {
                return res.status(404).json({
                    message: "пользователь не найден"
                })
            }
            const { hashedPassword, ...userData } = user._doc;
            res.json(userData);
        } catch (error) {
            console.log(error);
        }

    }
}
