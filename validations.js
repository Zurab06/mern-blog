import { body } from "express-validator";

export const loginValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть не короче 5 символов').isLength({ min: 5 }),
]

export const registrationValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 2 }),
    body('avatarUrl').optional().isURL(),
]

export const postCreateValidation = [
    body('title','введите заголовок стaтьи').isLength({min: 3}).isString(),
    body('text', "введите текст статьи").isLength({min: 10}).isString(),
    body('tags',"неверный формат тегов").optional().isArray(),
    body('imageUrl', "неверная ссылка на изображение").optional().isString()
]