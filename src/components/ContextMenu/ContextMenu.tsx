import { useShallow } from "zustand/react/shallow";
import { useSelectCellsStore } from "../../store/useSelectCellsStore";
import { useTableStore } from "../../store/useTableStore";
import styles from "./ContextMenu.module.css";

export type MousePosition = {
  x: number;
  y: number;
} | null;

type ContextMenuProps = {
  position: MousePosition;
  isMergedCell: (rowIdx: number, colIdx: number) => boolean;
};

function ContextMenu({ position, isMergedCell }: ContextMenuProps) {
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const [mergeCells, divideCell] = useTableStore(
    useShallow((state) => [state.mergeCells, state.divideCell])
  );

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;
    const { row: startRow, col: startCol } = { ...startIdx };
    const { row: endRow, col: endCol } = { ...endIdx };

    mergeCells(startRow, startCol, endRow - startRow, endCol - startCol);
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleDivideCell = () => {
    if (!startIdx || !endIdx) return;
    const { row: startRow, col: startCol } = { ...startIdx };

    divideCell(startRow, startCol);
    setStartIdx(null);
    setEndIdx(null);
  };

  if (position === null || !startIdx) return null;

  return (
    <ul className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      {isMergedCell(startIdx.row, startIdx.col) ? (
        <li onMouseDown={handleDivideCell}>나누기</li>
      ) : (
        <li onMouseDown={handleMergeCell}>합치기</li>
      )}
    </ul>
  );
}

export default ContextMenu;
