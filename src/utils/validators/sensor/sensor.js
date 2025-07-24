const { body } = require('express-validator');

const validateSensor = [
    body('location')
        .notEmpty().withMessage('Location is required'),
    body('parameter')
        .notEmpty().withMessage('Parameter is required'),
    body('value')
        .notEmpty().withMessage('Value is required')
        .isNumeric().withMessage('Value must be a number'),
    body('unit')
        .notEmpty().withMessage('Unit is required'),
    body('recordedAt')
        .notEmpty().withMessage('Recorded At is required')
        .isISO8601().withMessage('Recorded At must be a valid date'),
];

module.exports = { validateSensor };