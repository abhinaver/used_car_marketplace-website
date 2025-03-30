
import express from "express";
import {productDB} from "./database.js";


const router = express.Router();




router.get('/', (req, res) => {
    productDB.query("SELECT * FROM cars ", (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch products', details: err });
        return res.json(data);
    });
});

// Increment click count when "View Details" is clicked
router.post("/increment-clicks/:id", (req, res) => {
    const carId = req.params.id;
    const query = "UPDATE cars SET clicks = clicks + 1 WHERE id = ?";

    productDB.query(query, [carId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Click count updated" });
    });
});

// Fetch the top 3 most clicked cars
router.get("/most-demanded", (req, res) => {
    const query = "SELECT * FROM cars ORDER BY clicks DESC LIMIT 3";

    productDB.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

export default router;