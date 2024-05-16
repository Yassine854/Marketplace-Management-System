import { fireEvent, render, screen } from "@testing-library/react";

import Dropdown from "./Dropdown";

const items = [
  { name: "Item 1", key: "item1" },
  { name: "Item 2", key: "item2" },
  { name: "Item 3", key: "item3" },
];

describe("Dropdown", () => {
  it("renders with default props", () => {
    render(<Dropdown />);
  });

  it("renders with custom props", () => {
    render(
      <Dropdown
        items={items}
        selected={items[0]}
        setSelected={jest.fn()}
        width="w-40"
        bg="bg-gray-100"
      />,
    );
  });

  test("selects an item on click", () => {
    const setSelected = jest.fn();
    render(
      <Dropdown items={items} selected={items[0]} setSelected={setSelected} />,
    );
    const item = screen.getByText("Item 2");

    fireEvent.click(item);
    expect(setSelected).toHaveBeenCalledWith(items[1]);
  });
});
