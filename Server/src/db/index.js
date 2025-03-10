import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () =>{
  try{
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log('\nDatabase Connnected');
  }catch(err){
    console.log("Database connection failed ",err);
    process.exit(1);
  }
}

export default connectDB;
