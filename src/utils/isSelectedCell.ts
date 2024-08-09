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

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  return rowIdx >= minRow && rowIdx <= maxRow && colIdx >= minCol && colIdx <= maxCol;
};

export default isSelectedCell;
