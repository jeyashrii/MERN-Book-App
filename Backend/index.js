import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { Book } from "./models/bookModel.js";
import dotenv from "dotenv";
dotenv.config();
const mongoDBURL = process.env.mongoDBURL;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(200).send("welcome");
});

//route for save a book

app.post("/books", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishedYear) {
      res.status(400).send({ message: "send all required fields" });
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishedYear: req.body.publishedYear,
    };

    const book = await Book.create(newBook);
    res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//route to get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({ count: books.length, data: books });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//route to get book from id
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//update a book

app.put("/books/:id", async (req, res) => {
  try {
    //input validation
    if (!req.body.title || !req.body.author || !req.body.publishedYear) {
      res.status(400).send({ message: "send all required fields" });
    }

    const { id } = req.params;
    //update book by id
    const result = await Book.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "book not found" });
    }
    return res.status(200).send({ message: "book updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//delete book by id

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //delete book by id
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "book not found" });
    }
    return res.status(200).send({ message: "book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("app connected to DB ");
    app.listen(8000, () => console.log(`server listening on port ${PORT}`));
  })
  .catch((error) => console.log(error));
