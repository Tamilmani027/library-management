import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import libraryRouter from './routers/library.router.js';
import connectDB from './database/dbConfig.js';

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/library',libraryRouter)

connectDB();

app.listen(process.env.PORT,()=>{
	console.log(`Backend server started:${process.env.PORT}`);
});