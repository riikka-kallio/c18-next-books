import type { NextApiRequest, NextApiResponse } from "next";

import { getBooks, addBook} from '@/lib/server/controllers/books.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getBooks(req, res);
    case "POST":
      return addBook(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
