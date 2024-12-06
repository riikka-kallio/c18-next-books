import { useContext, useEffect } from "react";
import Layout from "@/components/layout";
import Image from "next/image";
// import BookItem from "@/components/book";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { BooksContext } from "@/components/contexts/book.context";
import Link from "next/link";

import type Book from "@/types/Book";

const Books = ({ serverData }: { serverData: Array<Book> }) => {
  const { loading, error, books, fetchBooks, deleteBook } =
    useContext(BooksContext);
  console.log("context books", books);

  let data = books;
  // add a bit for SSR (will cause hydration error)
  if (typeof window === "undefined") {
    console.log("SSR books", serverData);
    data = serverData;
  }

  console.log('final books', data);

  // Rehydrate on Client-side
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  let component = null;

  if(loading) {
    component = (<Typography>Loading...</Typography>)
  } else if (error) {
    component = (<Typography>{error.message}</Typography>)
  } else if (!Array.isArray(data)) {
    // @ts-ignore
    console.error(`'data' must be an array. Instead received ${data.toJSON ? data.toJSON() : data} of type ${data}`)
    component = (<Typography>Wrong data format. Please check console</Typography>)
  } else if (data.length === 0) {
    component = (<Typography>You have no books</Typography>)

  } else {
    component = (<List>
      {data.map(({ title, author, description, avatar_url, _id }) => (
        <ListItem key={_id}>
          <ListItemAvatar>
            <Avatar>
            <Image
                alt=""
                src={avatar_url!}
                width={2250}
                height={1390}
                layout="responsive"
            />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            {title} {author} {description}
          </ListItemText>
          <IconButton
            aria-label="view"
            href={`/${_id}`}
            component={Link}
            passHref
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="update"
            href={`/update/${_id}`}
            component={Link}
            passHref
          >
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteBook(_id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>)

  }

  return (
    <Layout>
      <Typography component="h1" variant="h3">List</Typography>
      {component}
    </Layout>
  );
};

export default Books;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import { getBooksQuery as getBooks } from "@/lib/books/queries";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
// export async function getStaticProps() {
//   const books = await getBooks();
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(books)),
//     },
//   };
// }

export async function getServerSideProps() {
  const books = await getBooks();
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(books)),
    },
  };
}
