import express from 'express';
import { addBook } from '../controllers/library.controller.js';

const router=express.Router();

router.post('/books',addBook);





export default router; 