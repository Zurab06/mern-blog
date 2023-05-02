import { body } from "express-validator";

export const registrationValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 2 }),
    body('avatarUrl').optional().isURL(),
]