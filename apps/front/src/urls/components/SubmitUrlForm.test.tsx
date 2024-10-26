import { expect, describe, test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useFormState } from "react-dom";

import { SubmitUrlForm } from "@/urls/components/SubmitUrlForm";

vi.mock("react-dom", () => ({
  useFormState: vi
    .fn()
    .mockImplementation(() => [
      { kind: "success", value: { message: "OK" } },
      vi.fn(),
      false,
    ]),
}));

describe("Submit Url Form", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test.skip("has expected elements", () => {
    render(<SubmitUrlForm />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDefined();

    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDefined();
  });

  test("submits valid form", () => {
    render(<SubmitUrlForm />);
    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(submit);

    expect(screen.getByText("OK")).toBeDefined();
  });

  test("shows error message on invalid form", () => {
    vi.mocked(useFormState).mockImplementation(() => [
      { kind: "error", error: { message: "Error" } },
      vi.fn(),
      false,
    ]);
    render(<SubmitUrlForm />);
    const submit = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(submit);

    expect(screen.getByText("Error")).toBeDefined();
  });
});
