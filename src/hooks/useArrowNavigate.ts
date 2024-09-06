import type { CellInfo } from '@/store/useTableStore';
import type { KeyboardEvent } from 'react';

import { useRef } from 'react';

type Direction = 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp';

const useArrowNavigate = (table: CellInfo[][]) => {
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);

  const navigateCell = (curr: [number, number], direction: Direction): [number, number] => {
    const [rowIdx, colIdx] = curr;
    let nextRowIdx = rowIdx;
    let nextColIdx = colIdx;

    switch (direction) {
      case 'ArrowRight':
        nextColIdx++;
        break;
      case 'ArrowLeft':
        nextColIdx--;
        break;
      case 'ArrowDown':
        nextRowIdx++;
        break;
      case 'ArrowUp':
        nextRowIdx--;
        break;
      default:
        return [rowIdx, colIdx];
    }

    const currentCell = table[rowIdx][colIdx];
    if (currentCell.merged) {
      const { rowSpan, colSpan } = currentCell.merged;
      if (direction === 'ArrowRight') {
        nextColIdx = colIdx + colSpan;
      } else if (direction === 'ArrowDown') {
        nextRowIdx = rowIdx + rowSpan;
      }
    }

    const nextCell = table[nextRowIdx][nextColIdx];
    if (nextCell && nextCell.merged) {
      const { rowIdx, colIdx } = nextCell.merged;
      return [rowIdx, colIdx];
    }

    nextRowIdx = Math.max(0, Math.min(nextRowIdx, table.length - 1));
    nextColIdx = Math.max(0, Math.min(nextColIdx, table[0].length - 1));

    return [nextRowIdx, nextColIdx];
  };

  const handleKeyDown = (e: KeyboardEvent, rowIdx: number, colIdx: number) => {
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) === -1) return;
    const [nextRowIdx, nextColIdx] = navigateCell([rowIdx, colIdx], e.key as Direction);
    cellRefs.current[nextRowIdx][nextColIdx].focus();
    console.log(nextRowIdx, nextColIdx);
  };
  return { cellRefs, handleKeyDown };
};

export default useArrowNavigate;
