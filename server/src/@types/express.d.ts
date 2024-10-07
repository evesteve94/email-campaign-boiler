// src/@types/express.d.ts

import * as express from 'express';

// Extend the express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Add other user properties as needed
        email: string; // Assuming your User model has an email
        // Add any other user properties you want to access here
      };
    }
  }
}