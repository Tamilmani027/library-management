const books = [];

// 1. Add new Book
export const addBook = (req, res) => {
    try {
        const book = req.body;

        if (!book || Object.keys(book).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Book data is required"
            });
        }

        const newBook = {
            ...book,
            id: books.length + 1,
            availableCopies: book.totalCopies
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