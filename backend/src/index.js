import express from 'express';
import connectDB from './db/index.db.js';
import dotenv from 'dotenv';
import app from './app.js'



dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Error in Port: ", error);
});
