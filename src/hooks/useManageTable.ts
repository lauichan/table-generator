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

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;
    const { row: startRow, col: startCol } = { ...startIdx };
    const { row: endRow, col: endCol } = { ...endIdx };

    mergeCells(startRow, startCol, endRow - startRow, endCol - startCol);
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleDivideCell = () => {
    if (!startIdx || !endIdx) return;
    const { row: startRow, col: startCol } = { ...startIdx };

    divideCell(startRow, startCol);
    setStartIdx(null);
    setEndIdx(null);
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
