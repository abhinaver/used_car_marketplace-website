import express from "express";
import { productDB } from "./database.js";

const router = express.Router();

// Fetch car details
router.get("/get-item/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM cars WHERE id = ?";
    
    productDB.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch item", details: err });
        if (result.length === 0) return res.status(404).json({ error: "Item not found" });

        res.json(result[0]);
    });
});

// Update car details
router.put("/update-item/:id", (req, res) => {
    const { id } = req.params;
    const { name, model, year_of_production, kilometers_driven, previous_owners, color, extra_fittings, price, phone, location, description, image_url, user_id } = req.body;

    if (!id || !user_id) {
        return res.status(400).json({ error: "Missing ID or user_id" });
    }

    const query = `
        UPDATE cars SET 
            name = ?, model = ?, year_of_production = ?, kilometers_driven = ?, 
            previous_owners = ?, color = ?, extra_fittings = ?, price = ?, 
            phone = ?, location = ?, description = ?, image_url = ? 
        WHERE id = ? AND user_id = ?
    `;

    productDB.query(query, 
        [name, model, year_of_production, kilometers_driven, previous_owners, color, extra_fittings, price, phone, location, description, image_url, id, user_id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to update car", details: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Car not found or unauthorized" });

            res.json({ message: "Car updated successfully" });
        }
    );
});

export default router;
