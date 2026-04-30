import mongoose  from "mongoose";

export const connectMongoDB = async (connectionUrl)=>{

  const connection =  await mongoose.connect(connectionUrl)
  return connection

}
