import { useContext } from "react";
import Layout from "@/components/layout";
import BookForm from "@/components/forms/book_form";

import { BooksContext } from "@/components/contexts/book.context";

const Books = () => {
  const { addBook } = useContext(BooksContext);
  return (
    <Layout>
      <h1>Add a Book</h1>
      <BookForm addBook={addBook} />
    </Layout>
  );
};

export default Books;
