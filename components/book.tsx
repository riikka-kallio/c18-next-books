import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import type Book from "@/types/Book";

type BookProps = {
  book: Book;
};

import { BooksContext } from "@/components/contexts/book.context";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const BookItem = ({ book: { _id, title, author, description, avatar_url } }: BookProps) => {
  const { deleteBook } = useContext(BooksContext);
  const router = useRouter();
  return (
    <>
      {/* <img src={avatar_url} alt="" width="200" /> */}
      <Image
        alt=""
        src={avatar_url!}
        width={200}
        height={200}
        // layout="responsive"
      />

      <Box component="dl">
        <Box sx={{ display: "flex" }}>
          <Box component="dt">Title</Box>
          <Box component="dd">{title}</Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box component="dt">Author</Box>
          <Box component="dd">{author}</Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex" }}>
          <Box component="dt">Description</Box>
          <Box component="dd">{description}</Box>
        </Box>
      
      {/* <Link href={`/${_id}`}>View Book</Link> */}
      <Link href={`/update/${_id}`}>Update</Link>

      <Button
        onClick={async () => {
          await deleteBook(_id);
          router.push("/");
        }}
      >
        delete
      </Button>
    </>
  );
};

export default BookItem;
