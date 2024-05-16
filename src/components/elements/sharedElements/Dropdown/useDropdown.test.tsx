import { act, renderHook } from "@testing-library/react-hooks";

import useDropdown from "./useDropdown";
import { waitFor } from "@testing-library/react";

describe("useDropdown hook", () => {
  test("toggles open state", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.open).toBe(false);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.open).toBe(true);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.open).toBe(false);
  });

  test("closes dropdown on click outside", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.open).toBe(true);

    // Simulate a click event outside the dropdown
    act(() => {
      document.dispatchEvent(new MouseEvent("click"));
    });

    // Wait for state update caused by the click event to be processed
    waitFor(() => {
      expect(result.current.open).toBe(false);
    });
  });
});
