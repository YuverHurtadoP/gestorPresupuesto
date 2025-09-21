//const express = require('express'); //CjS Common js

import express from 'express';//EMS Ecmascript module
 
import { connectDB } from './config/bd';
import { corsConfig } from './config/cors';
import 'dotenv/config';
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import expenseRoutes from "./routes/expenseRoutes";
// import { connectDB } from './config/db'; // Assuming you have a connectDB function to connect to your database
connectDB()

const app = express();

// cors config
app.use(cors(corsConfig))
app.use(express.json())


app.use("/api/auth", userRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/expenses", expenseRoutes);


export default app;