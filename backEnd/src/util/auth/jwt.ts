import { Response } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../../config/redis";
// import { tokenModel } from "../../models/tokenModel"; // Adjust the import path as needed

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';

interface TokenPayload {
    id: any;
    email: string;
    role: any;
}

// // Generate token and store refresh token in DB only
// export const generateToken = async (payload: TokenPayload): Promise<string> => {
//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
//     const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

//     // Store refresh token in database only
//     await tokenModel.findOneAndUpdate(
//         { userId: payload.id },
//         { 
//             userId: payload.id,
//             token: refreshToken 
//         },
//         { upsert: true, new: true }
//     );

//     return token;
// };

// // Set only the main token in cookie with your original settings
// export const setTokenCookie = (res: Response, token: string): void => {
//     res.cookie('jwt', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours as per your original
//         sameSite: 'strict'
//     });
// };

// // Clear token cookie and refresh token from DB
// export const clearTokenCookie = async (res: Response): Promise<void> => {
//     // Clear the cookie
//     res.clearCookie('jwt', {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict'
//     });

//     // Get userId from token if available and clear refresh token from DB
//     const cookies = res.req?.cookies;
//     if (cookies?.jwt) {
//         try {
//             const decoded = jwt.verify(cookies.jwt, JWT_SECRET) as TokenPayload;
//             await tokenModel.deleteOne({ userId: decoded.id });
//             console.log('refresh token cleared')
//         } catch (error) {
//             // Ignore verification errors during logout
//             console.log('error in cookie decode and delete')
//         }
//     }
// };

// // Verify main token
// export const verifyToken = (token: string): TokenPayload => {
//     return jwt.verify(token, JWT_SECRET) as TokenPayload;
// };

// // Verify refresh token from DB
// export const verifyRefreshToken = async (userId: string): Promise<TokenPayload> => {
//     const storedToken = await tokenModel.findOne({ userId });
//     if (!storedToken) {
//         throw new Error('No refresh token found');
//     }
    
//     return jwt.verify(storedToken.token, REFRESH_SECRET) as TokenPayload;
// };

// // Refresh token function
// export const refreshToken = async (userId: string): Promise<string> => {
//     try {
//         const decoded = await verifyRefreshToken(userId);
//         const newToken = jwt.sign(
//             { id: decoded.id, email: decoded.email, role: decoded.role },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//         return newToken;
//     } catch (error) {
//         throw new Error('Invalid refresh token');
//     }
// };

// Generate access token and store refresh token in Redis


export const generateToken = async (payload: TokenPayload): Promise<string> => {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1hr" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
  
    console.log('access token',token, refreshToken)
    console.log('access token, refreshtoken', refreshToken)
    // Store refresh token in Redis with key `refresh:<userId>`
    const key = `refresh:${payload.id}`;
    await redisClient.setEx(key, 7 * 24 * 60 * 60, refreshToken); // 7 days in seconds
  
    const savedToken = await redisClient.get(key);
    console.log('Stored refresh token in Redis:', savedToken);

    return token; // Return only access token
  };
  
  // Set only the access token in cookie
  export const setTokenCookie = (res: Response, token: string): void => {
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    //   maxAge: 24 * 60 * 60 * 1000, // 24 hours as per your original
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: "strict",
    });
  };
  
  // Clear token cookie and refresh token from Redis
  export const clearTokenCookie = async (res: Response): Promise<void> => {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  
    const cookies = res.req?.cookies;
    if (cookies?.jwt) {
      try {
        const decoded = jwt.verify(cookies.jwt, JWT_SECRET) as TokenPayload;
        await redisClient.del(`refresh:${decoded.id}`); // Remove refresh token from Redis
        console.log("Refresh token cleared from Redis");
      } catch (error) {
        console.log("Error decoding cookie or deleting from Redis:", error);
      }
    }
  };
  
  // Verify access token
  export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  };
  
  // Verify refresh token from Redis
  export const verifyRefreshToken = async (userId: string): Promise<TokenPayload> => {
    const refreshToken = await redisClient.get(`refresh:${userId}`);
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
  
    return jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;
  };
  
  // Refresh token function
  export const refreshToken = async (userId: string): Promise<string> => {
    try {
      const decoded = await verifyRefreshToken(userId);
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Optional: Rotate refresh token
      const newRefreshToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      await redisClient.setEx(`refresh:${userId}`, 7 * 24 * 60 * 60, newRefreshToken);
  
      return newToken;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  };