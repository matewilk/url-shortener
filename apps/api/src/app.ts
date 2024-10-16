import express from "express";
import bodyParser from "body-parser";

import { UrlService } from "./services/UrlService";
import { shortenUrlRoute } from "./routes/shortenUrlRoute";
import { redirectToUrlRoute } from "./routes/redirectToUrlRoute";
import { ErrorHandler } from "./error";
import { Base62 } from "./services/Hash";
import { RdbmsUrlRepository } from "./urls/RdbmsUrlRepository";
import { PrismaClient } from "@prisma/client";

const hash = new Base62();
const prisma = new PrismaClient();
const repository = new RdbmsUrlRepository(prisma);
const urlShorteningService = new UrlService(repository, hash);
const errorHandler = new ErrorHandler();

const app = express();

app.use(bodyParser.json());

app.post("/shorten", shortenUrlRoute(urlShorteningService, errorHandler));
app.get("/:shortUrl", redirectToUrlRoute(urlShorteningService, errorHandler));

export default app;
