import type { SelectedRange } from "../hooks/useSelectCells";

const isSelectedCell = (range: SelectedRange, rowIdx: number, colIdx: number): boolean => {
  const { startRow, endRow, startCol, endCol } = range;

  if (
    startRow === undefined ||
    endRow === undefined ||
    startCol === undefined ||
    endCol === undefined
  ) {
    return false;
  }

  return rowIdx >= startRow && rowIdx <= endRow && colIdx >= startCol && colIdx <= endCol;
};

export default isSelectedCell;
