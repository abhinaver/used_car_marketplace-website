import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("");
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "users") {
      axios
        .get("http://localhost:8081/admin/users?isAdmin=true")
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    } else if (activeTab === "cars") {
      axios
        .get("http://localhost:8081/get-cars")
        .then((res) => setCars(res.data))
        .catch(() => setCars([]));
    } else if (activeTab === "analytics") {
      axios
        .get("http://localhost:8081/admin/analytics?isAdmin=true")
        .then((res) => setAnalytics(res.data))
        .catch(() => setAnalytics([]));
    }
  }, [activeTab]);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:8081/admin/user/${id}`, { data: { isAdmin: true } })
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error(err));
  };

  const deleteCar = (id) => {
    axios
      .delete(`http://localhost:8081/admin/car/${id}`, { data: { isAdmin: true } })
      .then(() => setCars(cars.filter((c) => c.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-options">
        <button onClick={() => setActiveTab("users")}>Delete Users</button>
        <button onClick={() => setActiveTab("cars")}>Delete Car Posts</button>
        <button onClick={() => setActiveTab("analytics")}>View Analytics</button>
      </div>

      {activeTab === "users" && (
        <div className="admin-users">
          <h3>Users</h3>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.username} ({user.email})
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}

      {activeTab === "cars" && (
        <div className="admin-cars">
          <h3>Cars</h3>
          {cars.length > 0 ? (
            <ul>
              {cars.map((car) => (
                <li key={car.id}>
                  {car.name} - ₹{car.price}
                  <button onClick={() => deleteCar(car.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No cars found.</p>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="admin-analytics">
          <h3>Analytics (Car Clicks)</h3>
          {analytics.length > 0 ? (
            <ul>
              {analytics.map((car) => (
                <li key={car.id}>
                  {car.name} - {car.clicks} clicks
                </li>
              ))}
            </ul>
          ) : (
            <p>No analytics data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
