import { useContext } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
// import { fetchBooks } from "@/lib/books";
import BookForm from "@/components/forms/book_form";
import type Book from "@/types/Book";

import { BooksContext } from "@/components/contexts/book.context";

const UpdateBook = ({ serverData }:{ serverData:Book }) => {
  const router = useRouter();
  const { id } = router.query;
  const { updateBook, books } = useContext(BooksContext);
  let book = null;
  if (typeof window === "undefined") {
    book = serverData;
  } else {
    book = books.find(({ _id }) => _id === id);
  }
  console.log("🚀 ~ file: [id].tsx ~ line 23 ~ UpdateBook ~ book", book);
  if (!book) return <p>Error: Book not found!</p>;
  return (
    <Layout>
      <h1>Update Book</h1>
      <BookForm updateBook={updateBook} book={book} />
    </Layout>
  );
};

export default UpdateBook;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import { getBookQuery as getBook } from "@/lib/books/queries";

// This function gets called at build time
export async function getServerSideProps({ params }:{ params: { id: string } }) {
  const book = await getBook(params.id);
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(book)),
    },
  };
}
