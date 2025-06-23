const { initializeDatabase } = require("./db/db.connect");
const express = require("express");

const Book = require("./models/books.model");
initializeDatabase();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

//3. get all the books
async function readAllBooks() {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Books not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

//1 & 2 Add new book
async function addNewBookData(data) {
  try {
    const newBook = new Book(data);
    const save = await newBook.save();
    console.log("New Book", newBook);
    return save;
  } catch (error) {
    console.log("Error adding new book", error);
  }
}

app.post("/books", async (req, res) => {
  try {
    const newBookData = await addNewBookData(req.body);
    if (newBookData) {
      res.status(201).json({
        message: "Book Data added successfully",
        newBook: newBookData,
      });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add new Book." });
  }
});

//4. get a book's detail by its title
async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.bookTitle);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

//5.  get details of all the books by an author.
async function readBookByAuthor(bookAuthor) {
  try {
    const book = await Book.find({ author: bookAuthor });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:bookAuthor", async (req, res) => {
  try {
    const books = await readBookByAuthor(req.params.bookAuthor);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

//6. get all the books which are of "Business" genre.
async function readBookByGenre(bookGenre) {
  try {
    const books = await Book.find({ genre: bookGenre });
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
  try {
    const books = await readBookByGenre(req.params.bookGenre);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

//7. get all the books which was released in the year 2012.
async function readBookByPublishYear(year) {
  try {
    const books = await Book.find({ publishedYear: year });
    return books;
  } catch (error) {
    throw error;
  }
}

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const books = await readBookByPublishYear(req.params.year);
    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

//8. update a book's rating by Id Lean In from 4.1 to 4.5
async function updateBookDataById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    console.log("Updated Data", updatedBook);
    return updatedBook;
  } catch (error) {
    console.log("Error updating Data", error);
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookDataById(req.params.bookId, req.body);
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book data updated successfully.", updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book Data." });
  }
});

//9. update a book's rating by Title
async function updateBookDataByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    console.log("Updated Data", updatedBook);
    return updatedBook;
  } catch (error) {
    console.log("Error updating Data", error);
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookDataByTitle(
      req.params.bookTitle,
      req.body
    );
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book data updated successfully.", updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book Data." });
  }
});

//10. delete book by Id
async function deleteBook(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deleteBook;
  } catch (error) {
    console.log("Error in deleting book", error);
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);
    if (deleteBook) {
      res.status(200).json({ message: "Book Deleted successfully" });
    } else {
      res.status(404).json({ error: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Book" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
