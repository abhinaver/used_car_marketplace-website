import express from 'express';
import cors from 'cors';

 import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());


import signinRouter from "./models/signin.js";
app.use("/signup", signinRouter);

import loginRouter from "./models/login.js";
app.use("/login", loginRouter);

import productRouter from "./models/product.js";
app.use("/get-cars", productRouter);

import addproductRouter from "./models/addproduct.js";
app.use("/add-car", addproductRouter);

import sproductRouter from "./models/sproduct.js";
app.use("/get-car", sproductRouter);

import mylistRouter from "./models/mylist.js";
app.use("/user-cars", mylistRouter); 

import myProductRouter from "./models/myproduct.js";
app.use("/my-products", myProductRouter);

import editRoutes from "./models/edit.js"; // Import the edit routes
app.use("/", editRoutes); // Ensure the endpoint is active


import deleteCarRouter from "./models/delete.js";
app.use("/delete-car", deleteCarRouter);

import uploadRoutes from "./models/upload.js";
app.use("/", uploadRoutes);


import adminRouter from "./models/admin.js";
app.use("/admin", adminRouter);


app.listen(8081, () => {
    console.log(" Server running on port 8081");
});
