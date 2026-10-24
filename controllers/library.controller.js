import Book from "../models/books.schema.js";
import BorrowRecords from "../models/borrowRecordschema.js";
import Member from "../models/members.schema.js";


// 1. Add new Book
export const addBook = async (req, res) => {
    try {
         const {title,author,category,totalCopies} = req.body;

        // if (!title || !author || !category || totalCopies===undefined) {
        //    return res.status(400).json({
        //        success: false,
        //        message: "Missing required fields"
        //   });
        //}

        const newBook =await Book.create({
                        title,
						author,
						category,
						totalCopies,
						availableCopies:Number(totalCopies)
        });

        // books.push(newBook);

        return res.status(201).json({message: "Book created successfully", data: newBook});

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message});
    }
};

// 2. Register a new Member
export const addMember= async (req,res)=>{
	try{
			const {name,email,phone}=req.body;
 			// if (!name || !email || !phone){
            // return res.status(400).json({
            //    success: false,
            //    message: "Missing required fields"
            // });
        // }

        const newBook = await Member.create({
				name,
                email,
                phone
        });

        // members.push(newBook);

        return res.status(201).json({
            success: true,
            message: "new member created successfully",
            data: newBook
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

}

// 3. Borrow a Book
export const borrowBook= async (req,res)=>{
try {
    const {bookId} = req.params;
    const { memberId, borrowDate, returnDate } = req.body;

    // if (!memberId || !borrowDate || !returnDate) {
    //    return res.status(400).json({
    //        success: false,
    //        message: "All fields are required"
    //    });
    //}

    const book =await Book.findById(bookId);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const member =await Member.findById(memberId);

    if (!member) {
        return res.status(404).json({
            success: false,
            message: "Member not found"
        });
    }

    if (book.availableCopies <= 0) {
        return res.status(400).json({
            success: false,
            message: "No copies available"
        });
    }

    book.availableCopies-=1;
    await book.save();

    const newBorrowRecord = await BorrowRecords.create({
        bookId,
        memberId,
        borrowDate,
        returnDate
    });

   // borrowRecords.push(newBorrowRecord);

    return res.status(201).json({
        success: true,
        message: "New borrow record created",
        data: newBorrowRecord
    });

} catch (error) {
    return res.status(500).json({message: error.message});
}
}

// 4. Return a Book

export const returnBook= async (req,res)=>{
    try{
        const {borrowId} = req.params;
        const borrowBook= await BorrowRecords.findById(borrowId);

        if (!borrowBook) {
            return res.status(404).json({message: "Borrow record not found"});
            }

        if (borrowBook.status === "returned") {
            return res.status(400).json({message: "Book already returned"});
        }

        const book=await Book.findById(borrowBook.bookId);

        if (!book) {
            return res.status(404).json({message: "Book not found"});
        }
        
        borrowBook.status='returned';
        await borrowBook.save();
        book.availableCopies+= 1;
        await book.save();

        return res.status(200).json({
            success:true,
            message:'Book returned'

        })

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message
    });

    }

}

// 5. Get All Books

export const getAllbooks=async (req,res)=>{
    try {
        const books=await Book.find();
        if (!books){
        return res.status(404).json({
            success:false,
            message:"No books found"
        })
    }

    res.json({
        success:true,
        data:books
    })
} catch (error){
     return res.status(500).json({
        success: false,
        message: error.message
    });
}

}


// 6. Get All Borrowed Books
export const getBorrowed = async (req, res) => {
  try {

    const borrowRecords = await BorrowRecords.find()
      .populate("bookId")
      .populate("memberId");

    const borrowedBooks = borrowRecords.map(br => ({
      borrowId: br._id,
      bookTitle: br.bookId?.title || "Book not found",
      memberName: br.memberId?.name || "Member not found",
      borrowDate: br.borrowDate,
      returnDate: br.returnDate,
      status: br.status
    }));

    return res.status(200).json({
      success: true,
      data: borrowedBooks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 7. Get All Members 

export const getAllMemebers=async (req,res)=>{
     try {
        const members=await Member.find();
        if (!members){
        return res.status(404).json({
            success:false,
            message:"No members found"
        })
    }

    res.status(201).json({
        success:true,
        data:members
    })
} catch (error){
     return res.status(500).json({
        success: false,
        message: error.message
    });
}

};