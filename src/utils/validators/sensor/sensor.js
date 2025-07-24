const { body } = require('express-validator');

const validateSensor = [
    body('locationId')
        .notEmpty().withMessage('Location ID is required')
        .isInt().withMessage('Location ID must be an integer'),
    body('parameterId')
        .notEmpty().withMessage('Parameter ID is required')
        .isInt().withMessage('Parameter ID must be an integer'),
    body('value')
        .notEmpty().withMessage('Value is required')
        .isNumeric().withMessage('Value must be a number'),
    body('recordedAt')
        .notEmpty().withMessage('Recorded At is required')
        .isISO8601().withMessage('Recorded At must be a valid date'),
];

module.exports = { validateSensor };