import type { FocusEvent } from 'react';
import type { SelectedRange } from '@/store/useSelectCellsStore';

import { useTableStore } from '@store/useTableStore';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSelectCellsStore } from '@/store/useSelectCellsStore';
import useOutsideClick from './useOutsideClick';

const useSelectCells = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<SelectedRange>(null);
  const [dragEnd, setDragEnd] = useState<SelectedRange>(null);
  const { selectRange, setSelectRange } = useSelectCellsStore(
    useShallow((state) => ({ selectRange: state.selectRange, setSelectRange: state.setSelectRange })),
  );

  const mergedList = useTableStore((state) => state.mergedList);

  const handleMouseDown = (e: React.MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;;
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
    if (dragStart && dragEnd) {
      let startRow = Math.min(dragStart.row, dragEnd.row);
      let startCol = Math.min(dragStart.col, dragEnd.col);
      let endRow = Math.max(dragStart.row, dragEnd.row);
      let endCol = Math.max(dragStart.col, dragEnd.col);

      for (const { rowIdx, colIdx, rowSpan, colSpan } of mergedList) {
        const mergedEndRow = rowIdx + rowSpan;
        const mergedEndCol = colIdx + colSpan;

        if (startRow <= mergedEndRow && endRow >= rowIdx && startCol <= mergedEndCol && endCol >= colIdx) {
          startRow = Math.min(startRow, rowIdx);
          startCol = Math.min(startCol, colIdx);
          endRow = Math.max(endRow, mergedEndRow);
          endCol = Math.max(endCol, mergedEndCol);
        }
      }

      setSelectRange({ startRow, startCol, endRow, endCol });
    }
  }, [mergedList, dragStart, dragEnd, setSelectRange]);

  const isSelectedCell = (rowIdx: number, colIdx: number) => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;
    return rowIdx >= startRow && rowIdx <= endRow && colIdx >= startCol && colIdx <= endCol;
  };

  const handleOnFocus = (_: FocusEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (!selectRange) return;
    const { startRow, startCol, endRow, endCol } = selectRange;
    if (rowIdx >= startRow && rowIdx <= endRow && colIdx >= startCol && colIdx <= endCol) return;
    setSelectRange({ startRow: rowIdx, startCol: colIdx, endRow: rowIdx, endCol: colIdx });
  };

  useOutsideClick(tableRef, () => setSelectRange(null));

  return {
    tableRef,
    isSelecting,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    handleOnFocus,
    isSelectedCell,
    setSelectRange,
  };
};

export default useSelectCells;
