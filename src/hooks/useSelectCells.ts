import type { MouseEvent } from "react";
import type { CellType } from "../store/useTableStore";

import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "../store/useSelectCellsStore";

export type SelectedRange = {
  endRow?: number | undefined;
  endCol?: number | undefined;
  startRow?: number | undefined;
  startCol?: number | undefined;
};

const useSelectCells = (table: CellType[][]) => {
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const setSelectRange = (
    startIdx: { startRow: number; startCol: number } | null,
    endIdx: { endRow: number; endCol: number } | null
  ) => {
    setStartIdx(startIdx);
    setEndIdx(endIdx);
  };

  const isMergedCell = (rowIdx: number, colIdx: number) => {
    return !!table[rowIdx][colIdx].merged;
  };

  const handleMouseDown = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setStartIdx(null);
    setEndIdx(null);
    setStartIdx({ startRow: rowIdx, startCol: colIdx });
  };

  const handleMouseUp = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setEndIdx({ endRow: rowIdx, endCol: colIdx });
  };

  if (
    startIdx !== null &&
    endIdx !== null &&
    startIdx.startRow + startIdx.startCol > endIdx.endRow + endIdx.endCol
  ) {
    const temp = { startRow: endIdx.endRow, startCol: endIdx.endCol };
    setEndIdx({ endRow: startIdx.startRow, endCol: startIdx.startCol });
    setStartIdx(temp);
  }

  const range: SelectedRange = { ...startIdx, ...endIdx };
  return { range, handleMouseDown, handleMouseUp, setSelectRange };
};

export default useSelectCells;
