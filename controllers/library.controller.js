const books = [{
   "id": 1,
   "title": "Atomic Habits",
   "author": "James Clear",
   "category": "Self Help",
   "totalCopies": 5,
   "availableCopies": 5
}
];
const members=[{
   "id": 1,
   "name": "John",
   "email": "john@gmail.com",
   "phone": "9876543210"
}
];
const borrowRecords=[{
   "id": 1,
   "bookId": 1,
   "memberId": 1,
   "borrowDate": "2026-07-05",
   "returnDate": "2026-07-12",
   "status": "borrowed"
}
];

// 1. Add new Book
export const addBook = (req, res) => {
    try {
        const {title,author,category,totalCopies} = req.body;

        if (!title || !author || !category || totalCopies===undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const newBook = {
						id:books.length+1,
            title,
						author,
						category,
						totalCopies:Number(totalCopies),
						availableCopies:Number(totalCopies)
        };

        books.push(newBook);

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 2. Register a new Member
export const addMember=(req,res)=>{
	try{
			const {name,email,phone}=req.body;
 			if (!name || !email || !phone){
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const newBook = {
					id:members.length+1,
          name,
					email,
					phone:Number(phone)
        };

        members.push(newBook);

        return res.status(201).json({
            success: true,
            message: "new member created successfully",
            data: newBook
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}

// 3. Borrow a Book

export const borrowBook=(req,res)=>{
try {
    const bookId = Number(req.params.bookId);
    const { memberId, borrowDate, returnDate } = req.body;

    if (!memberId || !borrowDate || !returnDate) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const book = books.find(bk => bk.id === bookId);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const member = members.find(m => m.id === Number(memberId));

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

    book.availableCopies--;

    const newBorrowRecord = {
        id: borrowRecords.length + 1,
        bookId,
        memberId: Number(memberId),
        borrowDate,
        returnDate,
        status: "borrowed"
    };

    borrowRecords.push(newBorrowRecord);

    return res.status(201).json({
        success: true,
        message: "New borrow record created",
        data: newBorrowRecord
    });

} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    });
}
}

// 4. Return a Book

export const returnBook=(req,res)=>{
    try{
        const borrowId=Number(req.params.borrowId);
        const borrowBook=borrowRecords.find(b=>b.id==borrowId);

        if (!borrowBook) {
        return res.status(404).json({
            success: false,
            message: "Borrow record not found"
        });
    }
        if (borrowBook.status === "returned") {
            return res.status(400).json({
                success: false,
                message: "Book already returned"
            });
        }
        const book=books.find(b=>b.id==borrowId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }
        
        borrowBook.status='returned';
        book.availableCopies+= 1;

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