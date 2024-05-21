import { create } from "zustand";

type StatusState = {
  status: string;
  setStatus: (status: string) => void;
};

export const useStatusStore = create<StatusState>((set) => ({
  status: "open",
  setStatus: (status) => set(() => ({ status })),
}));
