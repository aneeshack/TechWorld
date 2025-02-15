import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
export interface AuthRequest extends Request{
    user?: {
        id: string,
        email: string,
        role: string
    }
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction):void =>{
    const token = req.cookies.jwt;

    if(!token){
         res.status(401).json({success:false, message: "Unauthorized: No token provided"})
         return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {id:string, email: string, role:string}

        req.user = {
            id:decoded.id,
            email: decoded.email,
            role: decoded.role
        }
        console.log('user',req.user)
        next();
    } catch (error) {
         res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
         return
    }
}