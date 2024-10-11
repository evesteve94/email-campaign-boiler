import { Request, Response, NextFunction } from 'express-serve-static-core';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    req.user
    ? next() // If user is authenticated, continue to the next middleware
    : res.status(401).send("Unauthorized - You must be logged in."); // If user is not authenticated, send a 401 error
}

export default isAuthenticated