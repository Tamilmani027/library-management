import express from 'express';
import { addBook, addMember, borrowBook, returnBook } from '../controllers/library.controller.js';

const router=express.Router();

router.post('/books',addBook);

router.post('/members',addMember);

router.post('/borrow/:bookId', borrowBook);

router.put('/return/:borrowId',returnBook);





export default router; 