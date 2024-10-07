// import { body, param } from 'express-validator';

// // Validator for creating a user
// export const validateCreateUser = [
//   body('email')
//     .isEmail()
//     .withMessage('Please provide a valid email address'),
//   body('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters long'),
//   body('campaigns')
//     .optional()
//     .isArray()
//     .withMessage('Campaigns should be an array'),
// ];

// // Validator for updating a user
// export const validateUpdateUser = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid user ID format'),
//   body('email')
//     .optional()
//     .isEmail()
//     .withMessage('Please provide a valid email address'),
//   body('password')
//     .optional()
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters long'),
//   body('campaigns')
//     .optional()
//     .isArray()
//     .withMessage('Campaigns should be an array'),
// ];

// // Validator for getting a user by ID
// export const validateGetUser = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid user ID format'),
// ];

// // Validator for deleting a user
// export const validateDeleteUser = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid user ID format'),
// ];
