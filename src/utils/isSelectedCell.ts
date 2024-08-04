import { SelectedRange } from "../hooks/useSelectCells";

const isSelectedCell = (range: SelectedRange, rowIdx: number, colIdx: number) => {
  if (
    range.startRow !== undefined &&
    range.endRow !== undefined &&
    range.startCol !== undefined &&
    range.endCol !== undefined &&
    rowIdx >= range.startRow &&
    rowIdx <= range?.endRow &&
    colIdx >= range.startCol &&
    colIdx <= range.endCol
  ) {
    return true;
  }
  return false;
};

export default isSelectedCell;
