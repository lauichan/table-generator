import type { MouseEvent } from "react";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "../store/useSelectCellsStore";
import { CellType } from "../store/useTableStore";

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

  const handleMouseDown = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setStartIdx(null);
    setEndIdx(null);
    setStartIdx({ startRow: rowIdx, startCol: colIdx });
  };

  const handleMouseUp = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2 || !startIdx) return;
    setEndIdx({ endRow: rowIdx, endCol: colIdx });
  };

  useEffect(() => {
    if (startIdx && endIdx) {
      let { startRow, startCol, endRow, endCol } = { ...startIdx, ...endIdx };

      if (startRow > endRow) [startRow, endRow] = [endRow, startRow];
      if (startCol > endCol) [startCol, endCol] = [endCol, startCol];

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const mergedCell = table[row][col].merged;
          if (mergedCell) {
            const { rowIdx, colIdx, rowSpan, colSpan } = mergedCell;
            startRow = Math.min(startRow, rowIdx);
            startCol = Math.min(startCol, colIdx);
            endRow = Math.max(endRow, rowIdx + rowSpan - 1);
            endCol = Math.max(endCol, colIdx + colSpan - 1);
          }
        }
      }

      if (
        startRow !== startIdx.startRow ||
        startCol !== startIdx.startCol ||
        endRow !== endIdx.endRow ||
        endCol !== endIdx.endCol
      ) {
        setStartIdx({ startRow, startCol });
        setEndIdx({ endRow, endCol });
      }
    }
  }, [startIdx, endIdx, setStartIdx, setEndIdx]);

  const range: SelectedRange = { ...startIdx, ...endIdx };
  return { range, handleMouseDown, handleMouseUp, setSelectRange };
};

export default useSelectCells;
