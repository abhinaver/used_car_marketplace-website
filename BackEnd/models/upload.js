import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js"; 
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const username = req.body.username || "general";  // Get username from body
        return {
            folder: `uploads/${username}`, 
            allowed_formats: ["jpg", "png", "jpeg"],
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
        };
    },
});


const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ imageUrl: req.file.path });
});

export default router;
