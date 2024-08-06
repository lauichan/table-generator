import { MouseEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "../store/useSelectCellsStore";

export type SelectedRange = {
  endRow?: number | undefined;
  endCol?: number | undefined;
  startRow?: number | undefined;
  startCol?: number | undefined;
};

const useSelectCells = () => {
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const handleMouseDown = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setStartIdx(null);
    setEndIdx(null);
    setStartIdx({ startRow: rowIdx, startCol: colIdx });
  };

  const handleMouseUp = (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    if (e.button === 2) return;
    setEndIdx({ endRow: rowIdx, endCol: colIdx });
  };

  if (
    startIdx !== null &&
    endIdx !== null &&
    startIdx.startRow + startIdx.startCol > endIdx.endRow + endIdx.endCol
  ) {
    const temp = { startRow: endIdx.endRow, startCol: endIdx.endCol };
    setEndIdx({ endRow: startIdx.startRow, endCol: startIdx.startCol });
    setStartIdx(temp);
  }

  const range: SelectedRange = { ...startIdx, ...endIdx };
  return { range, handleMouseDown, handleMouseUp };
};

export default useSelectCells;
