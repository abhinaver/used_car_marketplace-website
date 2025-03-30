import express from "express";
import { productDB } from "./database.js"; // Used Car Database

const router = express.Router();

// Delete car only if the user owns it
router.delete("/:username/:id", (req, res) => {
    const { username, id } = req.params;

    if (!id || !username) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const deleteQuery = `
        DELETE cars 
        FROM cars 
        JOIN Users ON cars.user_id = Users.id 
        WHERE cars.id = ? AND Users.username = ?
    `;

    productDB.query(deleteQuery, [id, username], (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Car not found or unauthorized" });
        }

        return res.json({ message: "Car deleted successfully", id });
    });
});


export default router;
