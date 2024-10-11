// import { body, param } from 'express-validator';

// // Validator for creating a campaign
// export const validateCreateCampaign = [
//   body('campaignName')
//     .notEmpty()
//     .withMessage('Campaign name is required'),
//   body('companyName')
//     .notEmpty()
//     .withMessage('Company name is required'),
//   body('companyDescription')
//     .notEmpty()
//     .withMessage('Company description is required'),
//   body('productDescription')
//     .notEmpty()
//     .withMessage('Product description is required'),
//   body('targetAudience')
//     .notEmpty()
//     .withMessage('Target audience is required'),
// ];

// // Validator for updating a campaign
// export const validateUpdateCampaign = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid campaign ID format'),
//   body('campaignName')
//     .optional()
//     .notEmpty()
//     .withMessage('Campaign name cannot be empty'),
//   body('companyName')
//     .optional()
//     .notEmpty()
//     .withMessage('Company name cannot be empty'),
//   body('companyDescription')
//     .optional()
//     .notEmpty()
//     .withMessage('Company description cannot be empty'),
//   body('productDescription')
//     .optional()
//     .notEmpty()
//     .withMessage('Product description cannot be empty'),
//   body('targetAudience')
//     .optional()
//     .notEmpty()
//     .withMessage('Target audience cannot be empty'),
// ];

// // Validator for getting a campaign by ID
// export const validateGetCampaign = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid campaign ID format'),
// ];

// // Validator for deleting a campaign
// export const validateDeleteCampaign = [
//   param('id')
//     .isUUID()
//     .withMessage('Invalid campaign ID format'),
// ];
