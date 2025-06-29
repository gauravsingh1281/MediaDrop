import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // 'image', 'video', 'pdf'
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
