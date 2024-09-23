import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useSelectCellsStore } from '@store/useSelectCellsStore';
import { type CellInfo, useTableStore } from '@store/useTableStore';

const useManageTable = () => {
  const { table, mergeCells, divideCell, setHeaderCells, setDataCells, clearCellsText } = useTableStore(
    useShallow((state) => ({
      table: state.table,
      mergeCells: state.mergeCells,
      divideCell: state.divideCell,
      setHeaderCells: state.setHeaderCells,
      setDataCells: state.setDataCells,
      clearCellsText: state.clearCellsText,
    })),
  );

  const { selectRange, setSelectRange } = useSelectCellsStore(
    useShallow((state) => ({ selectRange: state.selectRange, setSelectRange: state.setSelectRange })),
  );

  const { thead, tfoot } = useOptionStore(useShallow((state) => ({ thead: state.thead, tfoot: state.tfoot })));

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

  const handleClearCells = () => {
    if (!selectRange) return;
    clearCellsText(selectRange);
  };

  const isConvertible = (): boolean => {
    return selectRange !== null && selectRange.endRow >= thead;
  };

  const getCellInfo = (row: number, col: number): CellInfo | null => {
    if (row < 0 || row >= table.length || col < 0 || col >= table[0].length) return null;
    return table[row][col];
  };

  const isSelectionMergeable = (): boolean => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;
    if (startRow === endRow && startCol === endCol) return false;

    const cell = getCellInfo(startRow, startCol);
    if (cell && cell.merged) {
      const { rowSpan, colSpan } = cell.merged;
      return !(startRow + rowSpan - 1 === endRow && startCol + colSpan - 1 === endCol);
    }
    return true;
  };

  const isSelectionDivisible = (): boolean => {
    if (!selectRange) return false;
    const { startRow, startCol, endRow, endCol } = selectRange;

    const cell = getCellInfo(startRow, startCol);
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
    handleClearCells,
  };
};

export default useManageTable;
