import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "../../store/useSelectCellsStore";
import { CellType, useTableStore } from "../../store/useTableStore";
import styles from "./ContextMenu.module.css";

export type MousePosition = {
  x: number;
  y: number;
} | null;

type ContextMenuProps = {
  position: MousePosition;
  table: CellType[][];
};

function ContextMenu({ position, table }: ContextMenuProps) {
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const [mergeCells, divideCell] = useTableStore(
    useShallow((state) => [state.mergeCells, state.divideCell])
  );

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;
    const { startRow, startCol, endRow, endCol } = { ...startIdx, ...endIdx };

    const rowIdx = Math.min(startRow, endRow);
    const colIdx = Math.min(startCol, endCol);
    const rowSpan = Math.abs(endRow - startRow);
    const colSpan = Math.abs(endCol - startCol);

    for (let i = 0; i <= rowSpan; i++) {
      for (let j = 0; j <= colSpan; j++) {
        const cell = table[rowIdx + i][colIdx + j];
        if (cell.merged && cell.merged.origin) {
          const { rowIdx: originRow, colIdx: originCol } = cell.merged;
          divideCell(originRow, originCol);
        }
      }
    }

    mergeCells(rowIdx, colIdx, rowSpan, colSpan);
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleDivideCell = () => {
    if (!startIdx || !endIdx) return;
    const { startRow, startCol } = { ...startIdx, ...endIdx };

    divideCell(startRow, startCol);
    setStartIdx(null);
    setEndIdx(null);
  };

  const isSingleSelected =
    startIdx &&
    endIdx &&
    startIdx.startRow === endIdx.endRow &&
    startIdx.startCol === endIdx.endCol;

  if (position === null || !startIdx) return null;

  return (
    <ul className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      {isSingleSelected ? (
        <li onMouseDown={handleDivideCell}>나누기</li>
      ) : (
        <li onMouseDown={handleMergeCell}>합치기</li>
      )}
    </ul>
  );
}

export default ContextMenu;
