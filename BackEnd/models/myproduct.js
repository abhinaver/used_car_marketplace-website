import express from "express";
import { productDB } from "./database.js";

const router = express.Router();

router.get("/:username", (req, res) => {
    const username = req.params.username;
    console.log("🔍 Fetching user ID for:", username);

    // Fetch user ID using username
    productDB.query(
        "SELECT id FROM used_car.Users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.error("❌ Database error while fetching user ID:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }

            if (result.length === 0) {
                console.log("❌ User not found:", username);
                return res.status(404).json({ error: "User not found" });
            }

            const userId = result[0].id;
            console.log("✅ User ID found:", userId);

            // Fetch cars listed by this user
            productDB.query(
                `SELECT id, user_id, name, price, phone, location, description, 
                        image_url, created_at, model, year_of_production, 
                        kilometers_driven, previous_owners, color, extra_fittings
                 FROM used_car.cars WHERE user_id = ?`,
                [userId],
                (err, data) => {
                    if (err) {
                        console.error("❌ Error fetching user cars:", err);
                        return res.status(500).json({ error: "Failed to fetch user cars", details: err });
                    }

                    console.log("✅ Cars found:", data.length);
                    return res.json(data);
                }
            );
        }
    );
});

export default router;
