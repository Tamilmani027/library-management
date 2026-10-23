import mongoose from 'mongoose';
import Book from './books.schema.js';
import Member from './members.schema.js';


const borrowRecordSchema=mongoose.Schema({
	bookId:{
		type:mongoose.Schema.Types.ObjectId,
		ref: Book,
		trim:true
	},
   memberId:{
		type:mongoose.Schema.Types.ObjectId,
		ref: Member,
		required:true,
		trim:true
	} ,
   borrowDate: {
		type:Date,
		required:true,
		trim:true
	} ,
   returnDate: {
		type:Date,
		required:true,
		trim:true
	},
   status:{
		type: String,
		required:true,
		trim:true,
		enum:["borrowed","returned"],
		default:'borrowed'
	} 
},{})

const BorrowRecords=mongoose.model("borrowrecords",borrowRecordSchema);
export default BorrowRecords