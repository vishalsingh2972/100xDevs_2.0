import { Request, Response, NextFunction } from 'express';

export const monitor = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => { //triggered last when res is send back to client in index.ts
        const duration = Date.now() - start;
        console.log(`Request to ${req.path} took ${duration}ms`);
    });
    next();
};