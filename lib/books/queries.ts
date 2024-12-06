import type { BookData, BookUpdateData } from "@/components/forms/book_form";
import "@/lib/db";
import BookModel from "@/lib/server/models/book.model";

export const getBooksQuery = async () => {
  return await BookModel.find({}).exec();
};

export const getBookQuery = async (id: string) => {
  return await BookModel.findById(id);
};

export const addBookQuery = async (data: BookData) => {
  const book = new BookModel(data);
  const newBook = await book.save();
  return newBook;
};

export const updateBookQuery = async (id: string, data: BookUpdateData) => {
  return await BookModel.updateOne({ _id: id }, data);
};

export const removeBookQuery = async (id: string) => {
  return await BookModel.deleteOne({ _id: id });
};
