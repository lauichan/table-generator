import type { MouseEvent } from "react";
import type { CellType } from "@store/useTableStore";
import type { SelectedRange } from "@/store/useSelectCellsStore";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "@/store/useSelectCellsStore";

const useSelectCells = (table: CellType[][]) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<SelectedRange>(null);
  const [dragEnd, setDragEnd] = useState<SelectedRange>(null);
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const setSelectRange = (startIdx: SelectedRange, endIdx: SelectedRange) => {
    if (!startIdx || !endIdx) return;
    setStartIdx({ row: startIdx.row, col: startIdx.col });
    setEndIdx({ row: endIdx.row, col: endIdx.col });
  };

  const handleMouseDown = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setIsSelecting(true);
    setDragStart({ row: rowIdx, col: colIdx });
    setDragEnd({ row: rowIdx, col: colIdx });
  };

  const handleMouseOver = (_: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (!isSelecting) return;
    setDragEnd({ row: rowIdx, col: colIdx });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  useEffect(() => {
    if (!dragStart || !dragEnd) return;

    let startRow = Math.min(dragStart.row, dragEnd.row);
    let startCol = Math.min(dragStart.col, dragEnd.col);
    let endRow = Math.max(dragStart.row, dragEnd.row);
    let endCol = Math.max(dragStart.col, dragEnd.col);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = table[row][col];
        if (cell.merged) {
          const { rowIdx, colIdx, rowSpan, colSpan } = cell.merged;
          startRow = Math.min(startRow, rowIdx);
          startCol = Math.min(startCol, colIdx);
          endRow = Math.max(endRow, rowIdx + rowSpan - 1);
          endCol = Math.max(endCol, colIdx + colSpan - 1);
        }
      }
    }

    setStartIdx({ row: startRow, col: startCol });
    setEndIdx({ row: endRow, col: endCol });
  }, [dragStart, dragEnd, setStartIdx, setEndIdx]);

  const isMergedCell = (rowIdx: number, colIdx: number) => {
    const cell = table[rowIdx][colIdx];
    if (!cell.merged || !endIdx) return false;

    const { rowSpan, colSpan } = cell.merged;
    const singleEndRow = rowIdx + rowSpan - 1;
    const singleEndCol = colIdx + colSpan - 1;

    return endIdx.row === singleEndRow && endIdx.col === singleEndCol;
  };

  const isSelectedCell = (rowIdx: number, colIdx: number) => {
    if (!startIdx || !endIdx) return false;
    return (
      rowIdx >= startIdx.row &&
      rowIdx <= endIdx.row &&
      colIdx >= startIdx.col &&
      colIdx <= endIdx.col
    );
  };

  return {
    isSelecting,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isMergedCell,
    isSelectedCell,
    setSelectRange,
  };
};

export default useSelectCells;
