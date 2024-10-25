import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import Home from "@/app/page";

vi.mock("react-dom", () => ({
  useFormState: () => [{ message: "" }, vi.fn()],
}));

test("renders Shortify", () => {
  render(<Home />);
  const main = within(screen.getByRole("main"));
  const heading = main.getByRole("heading", { name: /Shortify/i });

  expect(heading).toBeDefined();

  const footer = screen.getByRole("contentinfo");
  expect(footer).toBeDefined();
});
