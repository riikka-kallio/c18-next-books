import React, { createContext, useState, useCallback } from "react";
import type Book from "@/types/Book";
// import { useToasts } from "react-toast-notifications";
// import cloneDeep from 'lodash.cloneDeep' <-- use if your objects get complex

interface updateFormData {
  title?: string;
  author?: string;
  description?: string;
  avatar_url?: string;
}

interface addFormData {
  title: string;
  author: string;
  description: string;
  avatar_url?: string;
}

interface BooksContextInterface {
  fetchBooks: () => void;
  addBook: (formData: addFormData) => Promise<void>;
  updateBook: (id: string, formData: updateFormData) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  loaded: boolean;
  loading: boolean;
  // isInitialLoad: boolean;
  error: null | Error;
  books: Book[];
}

const defaultValues: BooksContextInterface = {
  fetchBooks: () => [],
  addBook: () => new Promise(() => {}),
  updateBook: () => new Promise(() => {}),
  deleteBook: () => new Promise(() => {}),
  loaded: false,
  loading: false,
  // isInitialLoad: true,
  error: null,
  books: [],
};

let BOOKS_ENDPOINT = `/api/v1/books`;

if (typeof window === 'undefined') {
  BOOKS_ENDPOINT = process.env.NEXT_PUBLIC_BOOKS_ENDPOINT!;
} else {
  BOOKS_ENDPOINT = `${window.location.origin}/api/v1/books`
}


// https://nextjs-fullstack-rest-demo.vercel.app
export const BooksContext = createContext<BooksContextInterface>(defaultValues);

type BooksProviderProps = {
  children?: React.ReactNode;
  startingData: Book[];
};

export const BooksProvider = ({children, startingData=[]}: BooksProviderProps) => {
  // console.log('rendered provider');
  const [books, setBooks] = useState<Book[]>(Array.isArray(startingData)? startingData : [startingData]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  // const [isInitialLoad, setisInitialLoad] = useState<boolean>(true);
  // const [search, setSearch] = useState("");
  // const { addToast } = useToasts();

  const fetchBooks = useCallback(async () => {
    // console.log('loading', loading);
    // console.log('error', error);
    if (loading || loaded || error) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(BOOKS_ENDPOINT);
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("books", JSON.stringify(data));
      // }
      // console.log('data', data);
      setBooks(data);
    } catch (err:any) {
      setError(err.message || err.statusText);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [error, loaded, loading]);

  const addBook = useCallback(
    async (formData: addFormData) => {
      console.log("about to add", formData);
      try {
        const response = await fetch(BOOKS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(formData),
        });
        if (response.status !== 201) {
          throw response;
        }
        const savedBook = await response.json();
        console.log("got data", savedBook);
        const newBooks = [...books, savedBook];
        if (typeof window !== "undefined") {
          localStorage.setItem("books", JSON.stringify(newBooks));
        }
        setBooks(newBooks);
        // addToast(`Saved ${savedBook.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log("🚀 ~ file: book.context.tsx ~ line 121 ~ err", err);

        // addToast(`Error ${err.message || err.statusText}`, {
        //   appearance: "error",
        // });
      }
    },
    [books]
  );

  const updateBook = useCallback(
    async (id: string, formData: updateFormData) => {
      console.log("updating", id, formData);
      let updatedBook = null;
      // Get index
      const index = books.findIndex((book) => book._id === id);
      console.log("index", index);
      if (index === -1) throw new Error(`Book with index ${id} not found`);
      // Get actual book
      const oldBook:Book = books[index];
      console.log("oldBook", oldBook);

      // Send the differences, not the whole update
      const updates = {};

      for (const key of Object.keys(oldBook)) {
        if (key === "_id") continue;
        //@ts-ignore
        if (oldBook[key] !== formData[key]) {
          //@ts-ignore
          updates[key] = formData[key];
        }
      }

      try {
        const response = await fetch(`${BOOKS_ENDPOINT}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(updates),
        });

        if (response.status !== 200) {
          throw response;
        }

        // Merge with formData
        updatedBook = {
          ...oldBook,
          ...formData, // order here is important for the override!!
        };
        console.log("updatedBook", updatedBook);
        // recreate the books array
        const updatedBooks = [
          ...books.slice(0, index),
          updatedBook,
          ...books.slice(index + 1),
        ];
        if (typeof window !== "undefined") {
          localStorage.setItem("books", JSON.stringify(updatedBooks));
        }
        // addToast(`Updated ${updatedBook.name}`, {
        //   appearance: "success",
        // });
        setBooks(updatedBooks);
      } catch (err) {
        console.log("🚀 ~ file: book.context.tsx ~ line 187 ~ err", err);
      }
    },
    [books]
  );

  const deleteBook = useCallback(
    async (id: string) => {
      let deletedBook = null;
      try {
        const response = await fetch(`${BOOKS_ENDPOINT}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.status !== 204) {
          throw response;
        }
        // Get index
        const index = books.findIndex((book) => book._id === id);
        deletedBook = books[index];
        // recreate the books array without that book
        const updatedBooks = [...books.slice(0, index), ...books.slice(index + 1)];
        if (typeof window !== "undefined") {
          localStorage.setItem("books", JSON.stringify(updatedBooks));
        }
        setBooks(updatedBooks);
        console.log(`Deleted ${deletedBook.title}`);
        // addToast(`Deleted ${deletedBook.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log("🚀 ~ file: book.context.tsx ~ line 222 ~ err", err);
      }
    },
    [books]
  );

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        error,
        loaded,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

// export const useBooks = useContext(BooksContext);
