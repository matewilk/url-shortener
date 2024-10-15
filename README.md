# URL Shortener

This project is a URL shortener application consisting of a frontend built with Next.js and a backend API built with Express and Prisma. The project is organized as a monorepo using TurboRepo.

## Getting Started

### Runing dev env

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the dev env:

   ```sh
   npm run dev
   ```

3. Local endpoints:

   1. Frontend: [http://localhost:3000](http://localhost:3000)
   2. Backend: [http://localhost:3001](http://localhost:3001)

4. Env variables:

   1. Backend:
      1. dev - `apps/api/.env`
      2. integraton tests - `apps/api/.env.int.test`
   2. Infra:
      1. dev - `infra/.env.dev`
      2. integration tests - `infra/.env.int.test`

5. Docker compose:
   Is located in `infra/postgres-dev-compose.yml` and runs separate `devdb` and `testdb` databases.

6. Tests:

   1. Unit tests:

   ```sh
    npm run unit:test 
   ```

   2. Integration tests:

   ```sh
    npm run int:test
   ```

   Integration tests are run agains the `testdb` database.

7. CI/CD:
   1. Github actions are used for CI/CD.
   2. `ci.yml` builds and tests the project.
   3. `playwright.yml` runs end-to-end tests using Playwright.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
