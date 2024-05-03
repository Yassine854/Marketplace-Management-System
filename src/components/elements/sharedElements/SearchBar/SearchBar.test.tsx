import { fireEvent, render, screen } from "@testing-library/react";

import SearchBar from "./index"; // Assuming you have a SearchBar component

describe("SearchBar", () => {
  test("search bar updates value on input change", () => {
    render(<SearchBar />);

    const searchInput = screen.getByRole("textbox") as HTMLInputElement; // Assuming your input has role="textbox"

    fireEvent.change(searchInput, { target: { value: "Test query" } });

    expect(searchInput.value).toBe("Test query");
  });

  test("search function is called when user submits the form", () => {
    const searchFunctionMock = jest.fn();
    render(<SearchBar onSearch={searchFunctionMock} />);

    const searchInput = screen.getByRole("textbox") as HTMLInputElement;
    const submitButton = screen.getByRole("button") as HTMLButtonElement; // Assuming your submit button has role="button"

    fireEvent.change(searchInput, { target: { value: "Test query" } });
    fireEvent.click(submitButton);

    expect(searchFunctionMock).toHaveBeenCalledWith("Test query");
  });

  test("search function is called after 700ms when user stops typing, even when withInstantSearch prop is true", async () => {
    const searchFunctionMock = jest.fn();
    render(
      <SearchBar onSearch={searchFunctionMock} withInstantSearch={true} />,
    );

    const searchInput = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Test query" } });

    setTimeout(() => {
      expect(searchFunctionMock).toHaveBeenCalledWith("Test query");
    }, 700);
  });
});
