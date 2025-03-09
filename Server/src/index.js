import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import Razorpay from 'razorpay';

dotenv.config({
  path: "../.env"
})


export const instance = new Razorpay({
  key_id :  process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret
})


connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, () =>{
    console.log(`Server running on port: ${process.env.PORT}`)
  })
})
.catch((err) =>{
  console.log("Database connection Failed",err);
})
