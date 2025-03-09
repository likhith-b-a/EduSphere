import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.js";

export const isAuth =  async(req,res,next) => {
  try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")


    if(!token){
      throw new ApiError(403,"Unathorized request")
    }

    const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

    if(!user){
      throw new ApiError(401,"Invalid Access Token");
    }

    req.user = user;
    next();
  }catch(err){
    //throw new ApiError(401,err?.message || "Invalid Access Token");
    res.status(401).json({
                  success: false,
                  message: err.message || "Invalid Access Token"
              })
  }
}

export const isAdmin = (req,res,next) =>{
  try{
    if(req.user.role !== "admin"){
      return res.status(403).json({
        message: "You are not admin",
      });
    }
    next();
  }catch(err){
    res.status(500).json({
      message: err.message || "YOU ARE NOT ADMIN"
    })
}
}

