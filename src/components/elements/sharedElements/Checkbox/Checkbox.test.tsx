import "@testing-library/jest-dom";

import { fireEvent, render } from "@testing-library/react";

import Checkbox from "./Checkbox";
import React from "react";

describe("Checkbox Component", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("checks and unchecks on click", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox") as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(false);
  });

  it("calls onClick callback", () => {
    const onClickMock = jest.fn();
    const { getByRole } = render(<Checkbox onClick={onClickMock} />);

    const checkbox = getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(onClickMock).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);

    expect(onClickMock).toHaveBeenCalledWith(false);
  });

  it("sets initial checked state correctly", () => {
    const { getByRole } = render(<Checkbox isChecked={true} />);
    const checkbox = getByRole("checkbox") as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
  });

  it("toggles checked state on input change", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox") as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: true } });

    expect(checkbox.checked).toBe(true);
  });
});
