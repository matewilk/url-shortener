import { InMemoryUrlRepository } from "../../src/urls/repository/InMemoryUrlRepository";
import { UrlRepositorySpec } from "./UrlRepositorySpec";

UrlRepositorySpec.run(new InMemoryUrlRepository());
