import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import { usePartnerActions } from "@/features/marketplace/partners/hooks/usePartnerActions";

jest.mock("axios");
const mockedPatch = axios.patch as jest.Mock;

describe("Partner Profile Update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update partner profile successfully", async () => {
    const mockPartner = {
      id: "partner1",
      username: "partner",
      email: "partner@example.com",
    };
    mockedPatch.mockResolvedValue({
      status: 200,
      data: { partner: mockPartner },
    });

    const { result } = renderHook(() => usePartnerActions());

    let response;
    await act(async () => {
      response = await result.current.editPartner("partner1", {
        username: "partner",
        email: "partner@example.com",
      });
    });

    expect(mockedPatch).toHaveBeenCalledWith(
      "/api/marketplace/partners/partner1",
      { username: "partner", email: "partner@example.com" },
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    expect(response).toEqual(mockPartner);
  });

  it("should handle error when update fails", async () => {
    const originalError = console.error;
    console.error = jest.fn();

    mockedPatch.mockRejectedValue({
      response: { data: { message: "Failed to update partner" } },
    });

    const { result } = renderHook(() => usePartnerActions());

    let response;
    await act(async () => {
      response = await result.current.editPartner("partner1", {
        username: "partner",
      });
    });

    expect(response).toBeUndefined();

    console.error = originalError;
  });
});
