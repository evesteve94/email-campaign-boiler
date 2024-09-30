import { Request, Response, NextFunction } from 'express-serve-static-core';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    req.user
    ? next()
    : res.status(401).send("Unauthorized - You must be logged in.");
}

export default isAuthenticated