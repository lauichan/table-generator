import { create } from 'zustand';

export type SelectedRange = { row: number; col: number } | null;
export type SelectRange = { startRow: number; startCol: number; endRow: number; endCol: number } | null;

type State = {
  selectRange: SelectRange;
};

type Actions = {
  setSelectRange: (range: SelectRange) => void;
};

export const useSelectCellsStore = create<State & Actions>()((set) => ({
  selectRange: null,
  setSelectRange: (range) => set({ selectRange: range }),
}));
