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
      const { startRow, startCol, endRow, endCol } = { ...startIdx, ...endIdx };
      setStartIdx({ startRow: Math.min(startRow, endRow), startCol: Math.min(startCol, endCol) });
      setEndIdx({ endRow: Math.max(startRow, endRow), endCol: Math.max(startCol, endCol) });
    }
  }, [startIdx, endIdx, setStartIdx, setEndIdx]);

  useEffect(() => {
    if (startIdx && endIdx) {
      let { startRow, startCol, endRow, endCol } = { ...startIdx, ...endIdx };
      let changed = false;

      for (let row = startIdx.startRow; row <= endIdx.endRow; row++) {
        for (let col = startIdx.startCol; col <= endIdx.endCol; col++) {
          const mergedCell = table[row][col].merged;
          if (mergedCell) {
            const { rowIdx, colIdx, rowSpan, colSpan } = mergedCell;
            const newStartRow = Math.min(startRow, rowIdx);
            const newStartCol = Math.min(startCol, colIdx);
            const newEndRow = Math.max(endRow, rowIdx + rowSpan - 1);
            const newEndCol = Math.max(endCol, colIdx + colSpan - 1);

            if (
              newStartRow !== startRow ||
              newStartCol !== startCol ||
              newEndRow !== endRow ||
              newEndCol !== endCol
            ) {
              startRow = newStartRow;
              startCol = newStartCol;
              endRow = newEndRow;
              endCol = newEndCol;
              changed = true;
            }
          }
        }
      }

      if (changed) {
        setStartIdx({ startRow, startCol });
        setEndIdx({ endRow, endCol });
      }
    }
  }, [startIdx, endIdx, table]);

  const range: SelectedRange = { ...startIdx, ...endIdx };
  return { range, handleMouseDown, handleMouseUp, setSelectRange };
};

export default useSelectCells;
