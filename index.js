import express from "express";
import cors from "cors";
import  "dotenv/config" ;
import { connectMongoDB } from "./connection.js";
import userRouter from "./router/user.router.js";

const app = express();  

const PORT = process.env.PORT || 3000;

connectMongoDB(process.env.MONGODB_URL).then(()=>{
  console.log("Connected to MongoDB");
}).catch((error)=>{
  console.error("Error connecting to MongoDB:", error);
})

// Middleware
app.use(cors())
app.use(express.json())

app.use("/user", userRouter)

app.listen(PORT, async ()=>{
  console.log(`Server is running on port ${PORT}`);
})