import { InMemoryUrlRepository } from "../../src/urls/InMemoryUrlRepository";
import { UrlRepositorySpec } from "./UrlRepositorySpec";

UrlRepositorySpec.run(new InMemoryUrlRepository());
