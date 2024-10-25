import { expect, describe, test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import { Form } from "@/urls/components/Form";

vi.mock("react-dom", () => ({
  useFormState: () => [{ message: "OK" }, vi.fn()],
}));

describe("Submit Url Form", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("has expected elements", () => {
    render(<Form />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDefined();

    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDefined();
  });

  test("submits form", () => {
    render(<Form />);
    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(submit);

    expect(screen.getByText("OK")).toBeDefined();
  });
});
