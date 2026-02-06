import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Frontend Setup Smoke Test", () => {
  it("should be able to render a component", () => {
    render(<div data-testid="smoke">Works</div>);
    expect(screen.getByTestId("smoke")).toBeInTheDocument();
    expect(screen.getByTestId("smoke")).toHaveTextContent("Works");
  });
});
