import express from "express";
import bodyParser from "body-parser";

import shortenUrlRoute from "./routes/shortenUrlRoute";
import redirectToUrlRoute from "./routes/redirectToUrlRoute";

const app = express();

app.use(bodyParser.json());

app.use("/shorten", shortenUrlRoute);
app.use("/:shortUrl", redirectToUrlRoute);

export default app;
