const { body } = require('express-validator');
const prisma = require('../../../../prisma/client');

const validateUser = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 25 }).withMessage('Name must not exceed 25 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, { req }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: value
                }
            });

            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
]

module.exports = { validateUser }