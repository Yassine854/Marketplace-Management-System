import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RolePermissionMatrix from "@/features/marketplace/role-permissions/RolePermissionMatrix";
import "@testing-library/jest-dom";

const mockFetch = jest.fn();
global.fetch = mockFetch;
jest.mock("react-hot-toast", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("RolePermissionMatrix", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders roles and permissions and toggles a permission", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({ roles: [{ id: "1", name: "Manager" }] }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({ permissions: [{ id: "p1", resource: "Orders" }] }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({
          rolePermissions: [
            {
              id: "rp1",
              roleId: "1",
              permissionId: "p1",
              actions: ["read"],
              role: { id: "1", name: "Manager" },
              permission: { id: "p1", resource: "Orders" },
            },
          ],
        }),
        ok: true,
      })
      .mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<RolePermissionMatrix />);

    await waitFor(() => {
      expect(screen.getByText("Manager")).toBeInTheDocument();
      expect(screen.getByText("Orders")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole("checkbox");
    const checkedCheckbox = checkboxes.find(
      (cb) => (cb as HTMLInputElement).checked,
    );
    expect(checkedCheckbox).toBeDefined();
    expect(checkedCheckbox).toBeChecked();

    // Toggle the permission
    if (checkedCheckbox) {
      fireEvent.click(checkedCheckbox);
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
