import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useSelectCellsStore } from '@store/useSelectCellsStore';
import { useTableStore } from '@store/useTableStore';

const useManageTable = () => {
  const [table, mergeCells, divideCell, setHeaderCells, setDataCells] = useTableStore(
    useShallow((state) => [state.table, state.mergeCells, state.divideCell, state.setHeaderCells, state.setDataCells]),
  );

  const [selectRange, setSelectRange] = useSelectCellsStore(
    useShallow((state) => [state.selectRange, state.setSelectRange]),
  );

  const [thead, tfoot] = useOptionStore(useShallow((state) => [state.thead, state.tfoot]));

  const resetSelection = () => {
    setSelectRange(null);
  };

  const handleMergeCell = () => {
    if (!selectRange) return;
    const { startRow, startCol, endRow, endCol } = selectRange;

    if (thead > 0 && thead > startRow && thead <= endRow) {
      alert('머리글 옵션이 활성화 되어있습니다.\n머리글은 머리글끼리만 합칠 수 있습니다.');
      resetSelection();
      return;
    }

    if (tfoot > 0 && table.length - tfoot > startRow && table.length - tfoot <= endRow) {
      alert('바닥글 옵션이 활성화 되어있습니다.\n바닥글은 바닥글끼리만 합칠 수 있습니다.');
      resetSelection();
      return;
    }

    mergeCells(startRow, startCol, endRow - startRow, endCol - startCol);
    resetSelection();
  };

  const handleDivideCell = () => {
    if (!selectRange) return;
    const { startRow, startCol } = selectRange;

    divideCell(startRow, startCol);
    resetSelection();
  };

  const handleSetHeaderCell = () => {
    if (!selectRange) return;
    setHeaderCells(selectRange);
  };

  const handleSetDataCell = () => {
    if (!selectRange) return;
    const { startRow, endRow } = selectRange;
    if (endRow < thead) return;
    setDataCells({ ...selectRange, startRow: Math.max(startRow, thead) });
  };

  const isConvertible = (): boolean => {
    if (!selectRange || selectRange.endRow < thead) return false;
    return true;
  };

  const isSelectionMergeable = (): boolean => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;
    if (startRow === endRow && startCol === endCol) return false;

    const cell = table[startRow][startCol];
    if (cell && cell.merged) {
      const { rowSpan, colSpan } = cell.merged;
      return !(startRow + rowSpan - 1 === endRow && startCol + colSpan - 1 === endCol);
    }
    return true;
  };

  const isSelectionDivisible = (): boolean => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;

    const cell = table[startRow][startCol];
    if (cell && cell.merged) {
      const { rowIdx, colIdx, rowSpan, colSpan } = cell.merged;
      return rowIdx + rowSpan - 1 === endRow && colIdx + colSpan - 1 === endCol;
    }
    return false;
  };

  return {
    handleMergeCell,
    handleDivideCell,
    isConvertible,
    isSelectionMergeable,
    isSelectionDivisible,
    handleSetHeaderCell,
    handleSetDataCell,
  };
};

export default useManageTable;
