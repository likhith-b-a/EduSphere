import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import {sendMail, sendResetMail} from "../utils/sendMail.js";

const generateAccessAndRefreshTokens = async(userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken};
  }catch(err){
    throw new ApiError(500,"Something went wrong while generating access and refresh tokens");
  }
}

const registerUser = asyncHandler(async(req,res) => {

  const {name, email, password} = req.body;

  if (
    [name, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existingUser = await User.findOne({email});

  if(existingUser){
    throw new ApiError(409,"User with email already exists");
  }

  const user = {
    name,
    email,
    password
  }

  const otp = Math.floor(Math.random()*1000000);

  const activationToken = jwt.sign({
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m"
    }
  );

  const data = {
    name,
    otp,
  };

  await sendMail(
    email,
    "E learning otp verification",
    data
  )

  return res.status(201).json(
    new ApiResponse(200,activationToken,"otp sent successfully")
  )

})

const verifyUser = asyncHandler(async(req,res) => {
  const {otp , activationToken} = req.body

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if(!verify){
    throw new ApiError(400,"Otp Expired");
  }

  if(verify.otp !== otp){
    throw new ApiError(400,"Wrong OTP");
  }

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  })

  return res.status(201).json(
    new ApiResponse(200,{},"User registered SUccessfully")
  )

})

const loginUser = asyncHandler(async(req,res) => {
  const {email, password} = req.body;

  if (!email) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(400,"NO USER FOUND");
  }

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const getProfile = asyncHandler(async(req,res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  res.status(201).json(
    new ApiResponse(200,user,"Profile fetched Successfully")
  )
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user){
    throw new ApiError(404,"No User with this email found")
  }

  const token = jwt.sign({ email }, process.env.Forgot_Secret);

  const data = { email, token };
  console.log(email,token);

  await sendResetMail(
    email,
    "Forgot Password",
    data);

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  res.status(201).json(
    new ApiResponse(200,{},"Reset Password Link  Sent to your registered email")
  )
});

export const resetPassword = asyncHandler(async (req, res) => {

  const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

  const user = await User.findOne({ email: decodedData.email });

  if (!user){
    throw new ApiError(404,"No user with this email")
  }

  if (user.resetPasswordExpire === null)
    throw new ApiError(400,"Token Expired")
  
  if (user.resetPasswordExpire < Date.now()) {
    throw new ApiError(400,"Token Expired")
  }

  user.password = req.body.password;

  user.resetPasswordExpire = null;

  await user.save();

  res.status(201).json(
    new ApiResponse(200,{},"Password Reset Successfully"))
});

export {
  registerUser,
  verifyUser,
  loginUser,
  getProfile,
}

