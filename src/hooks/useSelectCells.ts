import { MouseEvent, useState } from "react";

const useSelectCells = () => {
  const [startIdx, setStartIdx] = useState<{ startRow: number; startCol: number } | null>(null);
  const [endIdx, setEndIdx] = useState<{ endRow: number; endCol: number } | null>(null);

  const handleMouseDown = (_: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    setStartIdx(null);
    setEndIdx(null);
    setStartIdx({ startRow: rowIdx, startCol: colIdx });
  };

  const handleMouseUp = (_: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => {
    setEndIdx({ endRow: rowIdx, endCol: colIdx });
  };

  if (
    startIdx !== null &&
    endIdx !== null &&
    startIdx?.startRow + startIdx?.startCol > endIdx?.endRow + endIdx?.endCol
  ) {
    const temp = { startRow: endIdx.endRow, startCol: endIdx.endCol };
    setEndIdx({ endRow: startIdx.startRow, endCol: startIdx.startCol });
    setStartIdx(temp);
  }

  const range = { ...startIdx, ...endIdx };
  return { range, handleMouseDown, handleMouseUp };
};

export default useSelectCells;
