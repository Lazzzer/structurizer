import { create } from "zustand";

export const useStepStore = create<{
  current: number;
  status: string;
}>(() => ({
  current: 0,
  status: "active",
}));
