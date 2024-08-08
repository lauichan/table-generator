import type { SelectedRange } from "../hooks/useSelectCells";

const isSelectedCell = (range: SelectedRange, rowIdx: number, colIdx: number): boolean => {
  return (
    range.startRow !== undefined &&
    range.endRow !== undefined &&
    range.startCol !== undefined &&
    range.endCol !== undefined &&
    rowIdx >= range.startRow &&
    rowIdx <= range?.endRow &&
    colIdx >= range.startCol &&
    colIdx <= range.endCol
  );
};

export default isSelectedCell;
