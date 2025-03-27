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

#### Local debugging:

Running the project from the main package.json file allows you to debug the backend and frontend in VSCode.

Run the main `dev` script in JavaScript Debug Terminal to enable breakpoints. This will start the `turbo run dev` script, which runs the backend and frontend concurrently.

You can set breakpoints and inspect variables.

- **Backend:**

  - works seemlessly with `turbo run dev` and `npm run dev` commands.

- **Frontend:**
  - to allow breakpoints for Next.js under current setup
    - the `--inspect` flag is added to the `dev` script in the `apps/front/package.json` file.
    - the vscode `launch.json `file is configured to attach to the Next.js process.
  - the `launch.json` file is located in the `.vscode` folder and it has to be manually launched from the debug tab in VSCode after the `dev` script is started.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
