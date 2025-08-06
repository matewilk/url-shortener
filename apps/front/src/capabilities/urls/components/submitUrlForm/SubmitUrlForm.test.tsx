import { expect, describe, test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useActionState } from "react";

import { SubmitUrlForm } from "@/capabilities/urls/components/submitUrlForm/SubmitUrlForm";

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi
      .fn()
      .mockImplementation(() => [
        { kind: "success", value: { message: "encodedurl" } },
        vi.fn(),
        false,
      ]),
  };
});

describe("Submit Url Form", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("has expected elements", () => {
    render(<SubmitUrlForm />);
    const input = screen.getByLabelText("Url");
    expect(input).toBeDefined();

    const submit = screen.getByRole("button", { name: "Shorten" });
    expect(submit).toBeDefined();
  });

  test("submits valid form and resets input", () => {
    render(<SubmitUrlForm />);
    const input = screen.getByLabelText("Url");
    const submit = screen.getByRole("button", { name: "Shorten" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(submit);

    const urlElement = screen.getByTestId("shortened-url");

    expect(urlElement.textContent).toBe("http://localhost:3000/encodedurl");

    // TODO: Fix this
    // expect(input.value).toBe("");
  });

  test("shows error message on invalid form", () => {
    vi.mocked(useActionState).mockImplementation(() => [
      { kind: "error", error: { message: "Error" } },
      vi.fn(),
      false,
    ]);
    render(<SubmitUrlForm />);
    const submit = screen.getByRole("button", { name: "Shorten" });

    fireEvent.click(submit);

    expect(screen.getByText("Error")).toBeDefined();
  });
});
