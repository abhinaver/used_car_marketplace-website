import express from "express";
import { authDB, productDB } from "./database.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ✅ Function to fetch user ID using username
const getUserId = (username) => {
    return new Promise((resolve, reject) => {
        authDB.query("SELECT id FROM Users WHERE username = ?", [username], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("User not found"));
            resolve(results[0].id);
        });
    });
};

router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Received Request Data:", req.body);

        const { 
            name, model, year_of_production, kilometers_driven, 
            previous_owners, color, extra_fittings, price, 
            phone, location, description, username 
        } = req.body;

        if (!username || !name || !location || !price || !phone) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        // ✅ Fetch user ID using the helper function
        let userId;
        try {
            userId = await getUserId(username);
            console.log("User ID found:", userId);
        } catch (err) {
            console.error("Error fetching user ID:", err);
            return res.status(404).json({ error: err.message });
        }

        // ✅ Validate `year_of_production`
        const year = parseInt(year_of_production, 10);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ error: "Invalid year_of_production. Must be between 1900 and the current year." });
        }

        // ✅ Upload image to Cloudinary (if present)
        let imageUrl = null;
        if (req.file) {
            try {
                console.log("Uploading image to Cloudinary...");
                const uploadedImage = await cloudinary.uploader.upload(req.file.path);
                imageUrl = uploadedImage.secure_url;
                console.log("Image uploaded:", imageUrl);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }

        // ✅ Insert into database
        const insertCarQuery = `
            INSERT INTO cars 
            (user_id, name, model, year_of_production, kilometers_driven, previous_owners, color, extra_fittings, price, phone, location, description, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userId, name, model, year, kilometers_driven, 
            previous_owners, color, extra_fittings === "true", 
            price, phone, location, description, imageUrl
        ];

        productDB.query(insertCarQuery, values, (err, result) => {
            if (err) {
                console.error("Insert car error:", err);
                return res.status(500).json({ error: "Failed to add car", details: err });
            }

            console.log("Car added successfully:", result.insertId);
            return res.json({ message: "Car listed successfully!", carId: result.insertId });
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
