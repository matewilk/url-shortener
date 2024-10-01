import express from "express";
import bodyParser from "body-parser";
import UrlShorteningService from "./services/UrlShortener";
import { dbService, InMemoryDb, InMemoryBase62Db } from "./services/Db";

import { shortenUrlRoute } from "./routes/shortenUrlRoute";
import { redirectToUrlRoute } from "./routes/redirectToUrlRoute";
import { ErrorHandler } from "./error";

const InMemDbService = new InMemoryBase62Db();
const urlShorteningService = new UrlShorteningService(InMemDbService);
const errorHandler = new ErrorHandler();

const app = express();

app.use(bodyParser.json());

app.post("/shorten", shortenUrlRoute(urlShorteningService, errorHandler));
app.get("/:shortUrl", redirectToUrlRoute(urlShorteningService, errorHandler));

export default app;
