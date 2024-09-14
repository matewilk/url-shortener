import express from "express";
import bodyParser from "body-parser";

import shortenRouter from "./routes/shorten";
import redirectRouter from "./routes/redirect";

const app = express();

app.use(bodyParser.json());

app.use("/shorten", shortenRouter);
app.use("/:shortUrl", redirectRouter);

export default app;
