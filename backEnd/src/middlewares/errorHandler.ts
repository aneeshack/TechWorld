import { Request, Response, NextFunction } from "express";

export class ErrorHandler {
    static handleError(err: Error, req: Request, res: Response, next: NextFunction){
        let statusCode = 500
    }
}