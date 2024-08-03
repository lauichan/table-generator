import { useRef, KeyboardEvent } from "react";
import type { CellType } from "../store/useTableStore";

const useArrowNavigate = (table: CellType[][]) => {
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTableCellElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (e.key === "ArrowRight") {
      if (colIdx < table[0].length - 1) {
        cellRefs.current[rowIdx][colIdx + 1].focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (colIdx > 0) {
        cellRefs.current[rowIdx][colIdx - 1].focus();
      }
    } else if (e.key === "ArrowDown") {
      if (rowIdx < table.length - 1) {
        cellRefs.current[rowIdx + 1][colIdx].focus();
      }
    } else if (e.key === "ArrowUp") {
      if (rowIdx > 0) {
        cellRefs.current[rowIdx - 1][colIdx].focus();
      }
    }
  };

  return { cellRefs, handleKeyDown };
};

export default useArrowNavigate;
