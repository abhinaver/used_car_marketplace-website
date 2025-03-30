import express from "express";
import { productDB } from "./database.js";

const router = express.Router();




router.get("/:id", (req, res) => {
    const { id } = req.params;

    productDB.query("SELECT * FROM cars WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch item details", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        return res.json(result[0]); // ✅ Return a single item object
    });
});





export default router;