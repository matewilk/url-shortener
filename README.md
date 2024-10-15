# URL Shortener

This project is a URL shortener application consisting of a frontend built with Next.js and a backend API built with Express and Prisma. The project is organized as a monorepo using TurboRepo.

## Getting Started

### Running Development Environment

#### Install dependencies:

```sh
npm install
```

#### Start the development environment:

```sh
npm run dev
```

#### Local Endpoints:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)

#### Environment Variables:

- **Backend:**
  - Development: `apps/api/.env`
  - Integration tests: `apps/api/.env.int.test`
- **Infrastructure:**
  - Development: `infra/.env.dev`
  - Integration tests: `infra/.env.int.test`

#### Docker Compose:

- Located in `infra/postgres-dev-compose.yml`
- Runs separate `devdb` and `testdb` databases.

#### Running Tests:

- **Unit Tests:**

  ```sh
  npm run unit:test
  ```

- **Integration Tests:**

  ```sh
  npm run int:test
  ```

  Integration tests are run against the `testdb` database.

#### CI/CD:

- GitHub Actions are used for CI/CD.
- `ci.yml` builds and tests the project.
- `playwright.yml` runs end-to-end tests using Playwright.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
