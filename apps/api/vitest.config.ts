import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      JWT_SECRET: "jwt-sercret-test",
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
