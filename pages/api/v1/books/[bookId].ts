import type { NextApiRequest, NextApiResponse } from "next";

import { updateBook, removeBook } from '@/lib/server/controllers/books.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateBook(req, res)
    case "DELETE":
      return removeBook(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
