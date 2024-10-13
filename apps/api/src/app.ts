import express from "express";
import bodyParser from "body-parser";

import UrlService from "./services/UrlService";
import { InMemoryUrlRepository } from "./urls/InMemoryUrlRepository";
import { shortenUrlRoute } from "./routes/shortenUrlRoute";
import { redirectToUrlRoute } from "./routes/redirectToUrlRoute";
import { ErrorHandler } from "./error";
import { Base62 } from "./services/Hash";

const hash = new Base62();
const repository = new InMemoryUrlRepository();
const urlShorteningService = new UrlService(repository, hash);
const errorHandler = new ErrorHandler();

const app = express();

app.use(bodyParser.json());

app.post("/shorten", shortenUrlRoute(urlShorteningService, errorHandler));
app.get("/:shortUrl", redirectToUrlRoute(urlShorteningService, errorHandler));

export default app;
