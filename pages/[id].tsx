import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { BooksContext } from "@/components/contexts/book.context";
import BookItem from "@/components/book";
import Layout from "@/components/layout";
import type Book from "@/types/Book";

function SingleBook({ serverData }:{ serverData:Book}) {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, books, fetchBooks } = useContext(BooksContext);
  let book = null;
  if (typeof window === "undefined") {
    book = serverData;
  } else {
    book = books.find(({ _id }) => _id === id);
  }

  console.log({ loading, error, book });

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <Layout>
      <Typography component="h1" variant="h3">Book</Typography>
      {loading && <Typography>Loading...</Typography>}
      {!loading && error && <Typography>{error.message}</Typography>}
      {!loading && !error && book && <BookItem book={book} />}
      {!loading && !error && !book && <Typography>Book with id {id} not found</Typography>}
    </Layout>
  );
}

export default SingleBook;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import { 
  getBookQuery as getBook, 
  // getBooksQuery as getBooks,
} from "@/lib/books/queries";
import Typography from "@mui/material/Typography";

export async function getServerSideProps({ params }:{ params:{ id: string } }) {
  const book = await getBook(params.id);
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(book)),
    },
  };
}

// This function gets called at build time
// export async function getStaticProps({ params }:{ params:{ id: string } }) {
//   const book = await getBook(params.id);
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(book)),
//     },
//   };
// }



// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
// export async function getStaticPaths() {
//   const books = await getBooks();
//   // Get the paths we want to pre-render based on books
//   const paths = books.map((book: Book) => ({
//     params: { id: book._id.toString() },
//   }));
//   console.log("paths", paths);

//   return { paths, fallback: "blocking" };
// }
