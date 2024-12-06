import mongoose from "mongoose";
import "@/lib/db";
const { Schema } = mongoose;

export const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar_url: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Open_book_nae_02.svg/1200px-Open_book_nae_02.svg.png",
  },
});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;
