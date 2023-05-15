import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import checkAuth from './middlewares/checkAuth.js'
import * as postController from './controllers/postController.js'
import * as UserController from './controllers/userController.js'
import { registrationValidation, loginValidation, postCreateValidation } from './validations.js'
const app = express()
const storage = multer.diskStorage({
    destination:(_,__,cb)=>{
        cb(null,'uploads')

    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
    
})
const upload = multer({storage})

mongoose.connect('mongodb+srv://gaunt0066:Panzerkampf06@cluster0.6m4r7dq.mongodb.net/archakov?retryWrites=true&w=majority')
    .then(() => console.log('mongo connected')).catch((error) => console.log(error))
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.post('/auth/registration', registrationValidation, UserController.registration)
app.post('/auth/login', loginValidation, UserController.login)
app.get('/auth/getuser', UserController.getUser)

app.get('/posts', postController.getAll)
app.post('/posts', checkAuth, postCreateValidation, postController.createPost)
app.get('/posts/:id', postController.getOne)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth, postController.updatePost)
app.post('/upload',checkAuth, upload.single('image'),(req,res)=>{
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