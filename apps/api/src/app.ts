import express from "express";
import bodyParser from "body-parser";
import { Prisma, PrismaClient } from "@prisma/client";

import UrlShorteningService from "./services/UrlShortener";
import { shortenUrlRoute } from "./routes/shortenUrlRoute";
import { redirectToUrlRoute } from "./routes/redirectToUrlRoute";
import { ErrorHandler } from "./error";
import { Base62 } from "./services/Hash";

const db = new PrismaClient();
const hash = new Base62();
const urlShorteningService = new UrlShorteningService(db, hash);
const errorHandler = new ErrorHandler();

const app = express();

app.use(bodyParser.json());

app.post("/shorten", shortenUrlRoute(urlShorteningService, errorHandler));
app.get("/:shortUrl", redirectToUrlRoute(urlShorteningService, errorHandler));

export default app;
