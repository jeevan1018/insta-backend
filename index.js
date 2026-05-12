import express from "express";
import cors from "cors";
import  "dotenv/config" ;
import { connectMongoDB } from "./connection.js";
import userRouter from "./router/user.router.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();  

const PORT = process.env.PORT || 3000;

connectMongoDB(process.env.MONGODB_URL).then(()=>{
  console.log("Connected to MongoDB");
}).catch((error)=>{
  console.error("Error connecting to MongoDB:", error);
})

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(authMiddleware)  // Decode JWT and set req.user on every request

app.use("/user", userRouter)

app.listen(PORT, async ()=>{
  console.log(`Server is running on port ${PORT}`);
})