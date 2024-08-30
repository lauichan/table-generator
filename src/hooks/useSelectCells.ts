import type { CellInfo } from '@store/useTableStore';
import type { SelectedRange } from '@/store/useSelectCellsStore';

import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSelectCellsStore } from '@/store/useSelectCellsStore';
import useOutsideClick from './useOutsideClick';

const useSelectCells = (table: CellInfo[][]) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<SelectedRange>(null);
  const [dragEnd, setDragEnd] = useState<SelectedRange>(null);
  const [selectRange, setSelectRange] = useSelectCellsStore(
    useShallow((state) => [state.selectRange, state.setSelectRange]),
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
    if (dragStart && dragEnd) {
      let startRow = Math.min(dragStart.row, dragEnd.row);
      let startCol = Math.min(dragStart.col, dragEnd.col);
      let endRow = Math.max(dragStart.row, dragEnd.row);
      let endCol = Math.max(dragStart.col, dragEnd.col);

      // 병합된 셀을 최소 선택범위에 넣으려고 하는 로직
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const cell = table[row][col];
          if (cell && cell.merged) {
            const { rowIdx, colIdx, rowSpan, colSpan } = cell.merged;
            startRow = Math.min(startRow, rowIdx);
            startCol = Math.min(startCol, colIdx);
            endRow = Math.max(endRow, rowIdx + rowSpan - 1);
            endCol = Math.max(endCol, colIdx + colSpan - 1);
          }
        }
      }
      // 1. 병합된 셀을 따로 저장해서 그 셀들에서 찾기
      // 2. 테이블이 바뀔때만 미리 정보를 저장, 선택할때는 계산 x

      setSelectRange({ startRow, startCol, endRow, endCol });
    }
  }, [table,dragStart, dragEnd, setSelectRange]);

  const isSelectedCell = (rowIdx: number, colIdx: number) => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;
    return rowIdx >= startRow && rowIdx <= endRow && colIdx >= startCol && colIdx <= endCol;
  };

  useOutsideClick(tableRef, () => setSelectRange(null));

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
