import express from "express";
import { authDB } from "./database.js"; // Your MySQL connection

const router = express.Router();

// Middleware to check if user is admin
const isAdminMiddleware = (req, res, next) => {
  // You can enhance this with authentication later
  // For now, assume front-end sends isAdmin in request headers/body
  const isAdmin = req.body.isAdmin || req.query.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

/* --------------------- USERS --------------------- */

// Get all users
router.get("/users", isAdminMiddleware, (req, res) => {
  const sql = "SELECT id, username, email, isAdmin FROM Users";
  authDB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users", details: err });
    res.json(results);
  });
});

// Delete a user
router.delete("/user/:id", isAdminMiddleware, (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM Users WHERE id = ?";
  authDB.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete user", details: err });
    res.json({ message: "User deleted successfully" });
  });
});

/* --------------------- CARS --------------------- */

// Delete a car
// Delete a car (admin can delete any car)
router.delete("/car/:id", isAdminMiddleware, (req, res) => {
  const carId = req.params.id;
  const sql = "DELETE FROM cars WHERE id = ?"; // 👈 use lowercase table name
  authDB.query(sql, [carId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete car", details: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  });
});


/* --------------------- ANALYTICS --------------------- */

// Get car clicks analytics
router.get("/analytics", isAdminMiddleware, (req, res) => {
  const sql = "SELECT id, name, clicks FROM cars ORDER BY clicks DESC";
  authDB.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch analytics", details: err });
    res.json(results);
  });
});

export default router;
