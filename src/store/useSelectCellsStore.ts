import { create } from 'zustand';

export type SelectedRange = { row: number; col: number } | null;

type State = {
  startIdx: SelectedRange;
  endIdx: SelectedRange;
};

type Actions = {
  setStartIdx: (idx: State['startIdx']) => void;
  setEndIdx: (idx: State['endIdx']) => void;
};

export const useSelectCellsStore = create<State & Actions>()((set) => ({
  startIdx: null,
  endIdx: null,
  setStartIdx: (idx) => set({ startIdx: idx }),
  setEndIdx: (idx) => set({ endIdx: idx }),
}));
