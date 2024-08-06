import { create } from "zustand";

type State = {
  startIdx: { startRow: number; startCol: number } | null;
  endIdx: { endRow: number; endCol: number } | null;
};

type Actions = {
  setStartIdx: (idx: State["startIdx"]) => void;
  setEndIdx: (idx: State["endIdx"]) => void;
};

export const useSelectCellsStore = create<State & Actions>()((set) => ({
  startIdx: null,
  endIdx: null,
  setStartIdx: (idx) => set({ startIdx: idx }),
  setEndIdx: (idx) => set({ endIdx: idx }),
}));
