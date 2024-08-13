import { useShallow } from "zustand/react/shallow";
import { useOptionStore } from "@store/useOptionStore";
import { useSelectCellsStore } from "@store/useSelectCellsStore";
import { useTableStore } from "@store/useTableStore";

const useManageTable = () => {
  const [table, mergeCells, divideCell] = useTableStore(
    useShallow((state) => [state.table, state.mergeCells, state.divideCell])
  );

  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const thead = useOptionStore((state) => state.thead);

  const resetSelection = () => {
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;

    if (thead && startIdx.row === 0 && endIdx.row > 0) {
      alert("머리글 옵션이 활성화 되어있습니다.\n머리글(첫번째 행)은 다른 행과 합칠 수 없습니다.");
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

  const isSelectionMergeable = (): boolean => {
    if (!startIdx || !endIdx) return false;
    if (startIdx.row === endIdx.row && startIdx.col === endIdx.col) return false;

    const cell = table[startIdx.row][startIdx.col];
    if (cell.merged) {
      const { rowSpan, colSpan } = cell.merged;
      const isOnlyMergedCell =
        startIdx.row + rowSpan - 1 === endIdx.row && startIdx.col + colSpan - 1 === endIdx.col;
      if (isOnlyMergedCell) return false;
    }

    return true;
  };

  const isSelectionDivisible = (): boolean => {
    if (!startIdx || !endIdx) return false;

    const cell = table[startIdx.row][startIdx.col];
    if (!cell.merged) return false;
    return cell.merged.rowSpan > 1 || cell.merged.colSpan > 1;
  };

  return { handleMergeCell, handleDivideCell, isSelectionMergeable, isSelectionDivisible };
};

export default useManageTable;
