import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
// import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@mui/material";

import Book from "@/types/Book";

const schema = yup.object().shape({
  title: yup.string().max(1000).required(),
  author: yup.string().max(1000).required(),
  description: yup.string().max(1000).required(),
  avatar_url: yup.string(),
});

export interface formData {
  title: string;
  author: string;
  description: string;
  avatar_url?: string;
}

export interface BookData {
  title: string;
  author: string;
  description: string;
  avatar_url?: string;
}
export interface BookUpdateData {
  title?: string;
  author: string;
  description: string;
  avatar_url?: string;
}

const defaults: { title: string; author: string; description: string, avatar_url: string } = {
  title: "",
  author: "",
  description: "",
  avatar_url: "",
};

type addFormFn = (formData: BookData) => Promise<void>;
type updateFormFn = (id: string, formData: BookData) => Promise<void>;

interface BookFormInput {
  book?: Book;
  addBook?: addFormFn;
  updateBook?: updateFormFn;
}

export default function BookForm({ book, addBook, updateBook }: BookFormInput) {
  console.log({ book });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    control,
  } = useForm({
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: defaults,
  });

  useEffect(() => {
    // console.log('useeffect', book);
    if (book) {
      const {  avatar_url="", description, author, title } = book;

      reset({
        title,
        author: String(author),
        description,
        avatar_url,
      });
    }
  }, [book, reset]);

  const formRowStyle = {
    marginBlockEnd: "1em",
  };

  const submitFn = (vals: formData) => {
    reset();
    const data: BookData = { ...vals, author: String(vals.author) };  //NOT SURE WHAT THIS DOES?

    if (book) {
      updateBook?.(book._id, data);
    } else {
      addBook?.(data);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(submitFn)}>
      <div style={formRowStyle}>
        <Controller
          control={control}
          name="title"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              type="name"
              fullWidth
              error={!!errors.title}
              {...field}
              label="title"
              helperText={errors.title?.message}
              required
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="author"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              type="text"
              fullWidth
              error={!!errors.author}
              {...field}
              label="author"
              helperText={errors.author?.message}
              required
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="description"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              type="text"
              fullWidth
              error={!!errors.description}
              {...field}
              label="description"
              helperText={errors.description?.message}
              required
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="avatar_url"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              fullWidth
              type="text"
              error={!!errors.avatar_url}
              {...field}
              label="Avatar URL"
              helperText={errors.avatar_url?.message}
            />
          )}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Button
          type="reset"
          onClick={() => reset()}
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!isDirty}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isDirty || (isDirty && !isValid)}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
