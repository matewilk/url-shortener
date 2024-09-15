import express from "express";
import bodyParser from "body-parser";

import shortenUrlRouter from "./routes/shortenUrlRoute";
import redirectToUrlRouter from "./routes/redirectToUrlRoute";

const app = express();

app.use(bodyParser.json());

app.use("/shorten", shortenUrlRouter);
app.use("/:shortUrl", redirectToUrlRouter);

export default app;
