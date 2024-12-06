// import Book from "../models/book.model";
import {NextApiRequest, NextApiResponse} from 'next'
import { 
  getBookQuery,
  getBooksQuery,
  addBookQuery,
  updateBookQuery,
  removeBookQuery,
 } from "@/lib/books/queries";

export const getBooks = async (req:NextApiRequest, res:NextApiResponse) => {
  // Does not work locally but will on Vercel
  res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");



  const { bookId: id } = req.query;

  try {
    const books = id ? await getBookQuery(id as string) : await getBooksQuery();
    return res.status(200).send(books);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const addBook = async (req:NextApiRequest, res:NextApiResponse) => {
  const bookData = req.body;

  if (bookData.avatar_url && bookData.avatar_url.startsWith("data:image")) {
    return res.status(400).send("NO_DATA_URIS_FOR_AVATAR");
  }

  if (!bookData.title) {
    return res.status(400).send("NO_TITLE_PROVIDED");
  }

  if (!bookData.author) {
    return res.status(400).send("NO_AUTHOR_PROVIDED");
  }

  if (!bookData.description) {
    return res.status(400).send("NO_DESCRIPTION_PROVIDED");
  }

  if (bookData.avatar_url === "") {
    delete bookData.avatar_url;
  }

  try {
    const newBook = await addBookQuery(bookData);
    return res.status(201).send(newBook);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateBook = async (req:NextApiRequest, res:NextApiResponse) => {
  const updateData = req.body;
  console.log(`Updating ${req.query.id}`, updateData);

  if (updateData.avatar_url && updateData.avatar_url.startsWith("data:image")) {
    return res.status(400).send("NO_DATA_URIS_FOR_AVATAR");
  }

  const isEmpty =
    req.body && // 👈 null and undefined check
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype;

  if (isEmpty) {
    return res.status(400).send("No update data provided");
  }
  
  const { bookId: id } = req.query;

  try {
    const result = await updateBookQuery((id as string), updateData);
    console.log("result", result);
    if (result.matchedCount === 0) return res.status(404).send("NOT FOUND");
    res.status(200).send("OK");
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const removeBook = async (req:NextApiRequest, res:NextApiResponse) => {
  const { bookId: id } = req.query;
  console.log("bookToBeDeleted", id);
  try {
    const result = await removeBookQuery(id as string);
    if (result.deletedCount === 0) return res.status(404).send("NOT FOUND");
    console.log("🚀 ~ file: books.controller.js ~ line 84 ~ result", result);
    res.status(204).send("NO CONTENT");
  } catch (err) {
    return res.status(500).send(err);
  }
};
