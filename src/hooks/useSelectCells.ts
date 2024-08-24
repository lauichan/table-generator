import type { CellType } from '@store/useTableStore';
import type { SelectedRange } from '@/store/useSelectCellsStore';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSelectCellsStore } from '@/store/useSelectCellsStore';

const useSelectCells = (table: CellType[][]) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<SelectedRange>(null);
  const [dragEnd, setDragEnd] = useState<SelectedRange>(null);
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx]),
  );

  const setSelectRange = useCallback(
    (startIdx: SelectedRange, endIdx: SelectedRange) => {
      if (!startIdx || !endIdx) {
        setStartIdx(null);
        setEndIdx(null);
      } else {
        setStartIdx({ row: startIdx.row, col: startIdx.col });
        setEndIdx({ row: endIdx.row, col: endIdx.col });
      }
    },
    [setStartIdx, setEndIdx],
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setIsSelecting(true);
    setDragStart({ row: rowIdx, col: colIdx });
    setDragEnd({ row: rowIdx, col: colIdx });
  };

  const handleMouseOver = (_: React.MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
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
  }, [table, dragStart, dragEnd, setStartIdx, setEndIdx]);

  const isSelectedCell = (rowIdx: number, colIdx: number) => {
    if (!startIdx || !endIdx) return false;
    return rowIdx >= startIdx.row && rowIdx <= endIdx.row && colIdx >= startIdx.col && colIdx <= endIdx.col;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectRange(null, null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSelectRange]);

  return {
    tableRef,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelectedCell,
    setSelectRange,
  };
};

export default useSelectCells;
