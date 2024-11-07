import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

// Mock the external data for recipients
jest.mock("../assets/recipientsData.json", () => [
  { email: "test1@example.com", isSelected: false },
  { email: "test2@example.com", isSelected: false },
  { email: "test3@example.com", isSelected: true },
]);

describe("App component", () => {
  // Test case: Rendering Available and Selected Recipients
  test("renders Available Recipients and Selected Recipients", () => {
    render(<App />);

    // Check Available Recipients
    expect(screen.getByText("Available Recipients")).toBeInTheDocument();
    expect(screen.getByText("test1@example.com")).toBeInTheDocument();
    expect(screen.getByText("test2@example.com")).toBeInTheDocument();

    // Check Selected Recipients
    expect(screen.getByText("Selected Recipients")).toBeInTheDocument();
    expect(screen.getByText("test3@example.com")).toBeInTheDocument();
  });

  // Test case: Selecting a domain for available recipients
  test("selects a domain for available recipients", () => {
    render(<App />);

    // Click to select 'example.com'
    const selectButton = screen.getByText("Add").closest("button");
    fireEvent.click(selectButton!);

    // Ensure that the recipients from 'example.com' are now selected
    expect(screen.getByText("test1@example.com")).toHaveTextContent(
      "test1@example.com"
    );
    expect(screen.getByText("test2@example.com")).toHaveTextContent(
      "test2@example.com"
    );
  });
});
