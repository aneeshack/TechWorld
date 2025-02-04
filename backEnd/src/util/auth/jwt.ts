import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

export const generateToken = (payload:object):string =>{
    console.log('payload',payload)
    return jwt.sign(payload,JWT_SECRET, { expiresIn:'1hr'})
}