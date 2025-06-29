import mongoose from "mongoose";
const mongoDbConnect = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
export default mongoDbConnect;
