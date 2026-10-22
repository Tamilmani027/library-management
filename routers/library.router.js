import express from 'express';
import { addBook, addMember, borrowBook, getAllbooks, getAllMemebers, getBorrowed, returnBook } from '../controllers/library.controller.js';

const router=express.Router();

router.post('/books',addBook);

router.post('/members',addMember);

router.post('/borrow/:bookId', borrowBook);

router.put('/return/:borrowId',returnBook);

router.get('/books',getAllbooks);

router.get('/borrowed',getBorrowed);

router.get('/members',getAllMemebers);





export default router; 