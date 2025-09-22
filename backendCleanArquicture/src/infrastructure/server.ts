//const express = require('express'); //CjS Common js

import express from 'express';//EMS Ecmascript module
 
 
import 'dotenv/config';
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import { connectDB } from './db/mongooseConnection';
import { corsConfig } from './cors';
 
// import { connectDB } from './config/db'; // Assuming you have a connectDB function to connect to your database
connectDB()

const app = express();

// cors config
app.use(cors(corsConfig))
app.use(express.json())


app.use("/api/auth/", userRoutes);
 

export default app;