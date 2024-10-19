import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();


import authRouter from './routes/auth.route.js';

const app = express();
app.use(express.json());
app.use(cookieParser());


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to database');
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


app.use('/api/admin', authRouter);


app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    })
  })
