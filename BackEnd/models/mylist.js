import express from "express";
import { productDB } from "./database.js";

const router = express.Router();

router.get("/:username", (req, res) => {
    const { username } = req.params;
    console.log(`🔍 Fetching cars for user: ${username}`);

    const getUserIdQuery = "SELECT id FROM Users WHERE username = ?";

    productDB.query(getUserIdQuery, [username], (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (result.length === 0) {
            console.log(`❌ User not found: ${username}`);
            return res.status(404).json({ error: "User not found" });
        }

        const userId = result[0].id;
        console.log(`✅ Found user ID: ${userId} for username: ${username}`);

        const getUserCarsQuery = "SELECT * FROM cars WHERE user_id = ?";

        productDB.query(getUserCarsQuery, [userId], (err, data) => {
            if (err) {
                console.error("❌ Error fetching user cars:", err);
                return res.status(500).json({ error: "Failed to fetch user cars", details: err });
            }

            console.log(`✅ Found ${data.length} cars for user: ${username}`);
            return res.json(data);
        });
    });
});

export default router;
