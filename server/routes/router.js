import express from "express";
import multer from "multer";
import User from "../database/model/user.js";
import imagekit from "../utils/imagekit.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype === "application/pdf") return "pdf";
  return "other";
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const { userName } = req.body;

    if (!userName || !req.file) {
      return res.status(400).json({ error: "Username and file are required" });
    }

    const fileType = getFileType(mimetype);
    if (fileType === "other") {
      return res
        .status(400)
        .json({ error: "Only image, video, or PDF allowed" });
    }

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer,
      fileName: originalname,
      folder: "/user-uploads",
    });

    const userData = new User({
      username: userName,
      fileUrl: result.url,
      fileId: result.fileId,
      fileType,
      originalName: originalname,
    });

    const savedUser = await userData.save();
    res.status(201).json({
      status: 201,
      savedUser,
      message: `${fileType} uploaded successfully!`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});
// GET
router.get("/getUserData", async (req, res) => {
  try {
    const foundUser = await User.find();
    res.status(200).json({ status: 200, foundUser });
  } catch (error) {
    res.status(500).json({ status: 500, error });
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await imagekit.deleteFile(user.fileId);
    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: 200,
      message: "User and file deleted successfully",
      deletedUser: user,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
});

export default router;
