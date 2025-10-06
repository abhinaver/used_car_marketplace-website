import express from "express";
import {authDB} from "./database.js";
const router = express.Router();

router.post('/', (req, res) => {
    const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
    const values = [req.body.email, req.body.password];

    authDB.query(sql, values, (err, data) => {
        if (err) return res.json({ error: "Login failed", details: err });

        if (data.length > 0) {
            const user = data[0];
            console.log("Login user from DB:", user); // 🔹 Debug
            return res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin === 1 // ✅ convert MySQL TINYINT 1/0 to boolean
                }
            });
        } else {
            return res.json({ error: "Invalid credentials" });
        }
    });
});



export default router;