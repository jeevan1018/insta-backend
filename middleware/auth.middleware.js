
import jwt from "jsonwebtoken";
/**
 * 
 * @param {import("express").NextFunction} req 
 * @param {import("express").Response} res 
 * @param {import("express").Request} next 
 * @returns 
 */

export const authMiddleware = (req, res, next) => {

    try{
  const authHeader = req.headers.authorization; 
  if(!authHeader){
    return next();
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if(!token){
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = decoded; 
  next();
    }catch(error){
        console.error("Error in auth middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }  
    return next(); 
    };