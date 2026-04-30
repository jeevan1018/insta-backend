import express from "express";
import  "dotenv/config" ;
import { connectMongoDB } from "./connection.js";
import userRouter from "./router/user.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();  

const PORT = process.env.PORT || 3000;



connectMongoDB(process.env.MONGODB_URL).then(()=>{
  console.log("Connected to MongoDB");
}).catch((error)=>{
  console.error("Error connecting to MongoDB:", error);
})

app.use(express.json())
app.use(authMiddleware)

app.use("/user", userRouter)


app.listen(PORT, async ()=>{
  console.log(`Server is running on port ${PORT}`);

})