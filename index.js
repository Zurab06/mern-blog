import express from 'express'
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
import checkAuth from './middlewares/checkAuth.js'
import * as postController from './controllers/postController.js'
import * as UserController from './controllers/userController.js'
import { registrationValidation, loginValidation, postCreateValidation } from './validations.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')

    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }

})
const upload = multer({ storage })
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://gaunt0066:Panzerkampf06@cluster0.6m4r7dq.mongodb.net/archakov?retryWrites=true&w=majority')
    .then(() => console.log('mongo connected')).catch((error) => console.log(error))
app.use('/uploads', express.static('uploads'))
app.post('/auth/registration', registrationValidation, handleValidationErrors, UserController.registration)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/getuser', UserController.getUser)

app.get('/tags',postController.getLastTags)
app.get('posts/tags',postController.getLastTags)
app.get('/posts', postController.getAll)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.createPost)
app.get('/posts/:id', postController.getOne)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.updatePost)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })

    
})

app.listen(3004, (err) => {
    if (err) {
        return res.json(err)
    }
    console.log('server has benn started');

})