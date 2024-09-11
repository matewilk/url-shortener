import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import { z } from "zod";

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
