import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useSelectCellsStore } from '@store/useSelectCellsStore';
import { useTableStore } from '@store/useTableStore';

const useManageTable = () => {
  const [table, mergeCells, divideCell, toggleCellsType] = useTableStore(
    useShallow((state) => [state.table, state.mergeCells, state.divideCell, state.toggleCellsType]),
  );

  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx]),
  );

  const thead = useOptionStore((state) => state.thead);

  const resetSelection = () => {
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;

    if (thead && endIdx.row >= thead) {
      alert('머리글 옵션이 활성화 되어있습니다.\n머리글은 머리글끼리만 합칠 수 있습니다.');
      resetSelection();
      return;
    }

    const { row: startRow, col: startCol } = startIdx;
    const { row: endRow, col: endCol } = endIdx;

    mergeCells(startRow, startCol, endRow - startRow, endCol - startCol);
    resetSelection();
  };

  const handleDivideCell = () => {
    if (!startIdx || !endIdx) return;
    const { row: startRow, col: startCol } = startIdx;

    divideCell(startRow, startCol);
    resetSelection();
  };

  const handleToggleCellType = () => {
    if (!startIdx || !endIdx) return;

    const startIdxWithThead = {
      row: Math.max(startIdx.row, thead),
      col: startIdx.col,
    };

    if (endIdx.row < thead) return;

    toggleCellsType(startIdxWithThead, endIdx);
    resetSelection();
  };

  const isSelectionMergeable = (): boolean => {
    if (!startIdx || !endIdx) return false;
    if (startIdx.row === endIdx.row && startIdx.col === endIdx.col) return false;

    const cell = table[startIdx.row][startIdx.col];
    if (cell.merged) {
      const { rowSpan, colSpan } = cell.merged;
      return !(startIdx.row + rowSpan - 1 === endIdx.row && startIdx.col + colSpan - 1 === endIdx.col);
    }

    return true;
  };

  const isSelectionDivisible = (): boolean => {
    if (!startIdx || !endIdx) return false;

    const cell = table[startIdx.row][startIdx.col];
    if (cell.merged) {
      const { origin, rowIdx, colIdx, rowSpan, colSpan } = cell.merged;
      return origin && rowIdx + rowSpan - 1 === endIdx.row && colIdx + colSpan - 1 === endIdx.col;
    }

    return false;
  };

  return {
    handleMergeCell,
    handleDivideCell,
    isSelectionMergeable,
    isSelectionDivisible,
    handleToggleCellType,
  };
};

export default useManageTable;
