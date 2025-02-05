import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

export const generateToken = (payload:object):string =>{
    return jwt.sign(payload,JWT_SECRET, { expiresIn:'1hr'})
}

export const setTokenCookie = (res: Response, token: string):void => {
    res.cookie('jwt',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24*60*60*1000,
        sameSite: 'strict'
    })
}

export const clearTokenCookie = (res: Response):void=>{
    res.clearCookie('jwt',{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })
}
