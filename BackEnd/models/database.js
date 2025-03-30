import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
};


const authDB = mysql.createPool({ ...dbConfig, database: "used_car" });
const productDB = mysql.createPool({ ...dbConfig, database: "used_car" });


const connectDB = (db, name) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error(`❌ ${name} connection failed:`, err);
        } else {
            console.log(`✅ Connected to ${name}`);
            connection.release(); 
        }
    });
};

connectDB(authDB, "AuthDB (Users)");
connectDB(productDB, "ProductDB (cars)");


export { authDB, productDB };
