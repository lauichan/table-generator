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
};

function ContextMenu({ position }: ContextMenuProps) {
  const [startIdx, endIdx, setStartIdx, setEndIdx] = useSelectCellsStore(
    useShallow((state) => [state.startIdx, state.endIdx, state.setStartIdx, state.setEndIdx])
  );

  const mergeCells = useTableStore((state) => state.mergeCells);

  const handleMergeCell = () => {
    if (!startIdx || !endIdx) return;
    const rowSpan = endIdx.endRow - startIdx.startRow;
    const colSpan = endIdx.endCol - startIdx.startCol;
    mergeCells(startIdx.startRow, startIdx.startCol, rowSpan, colSpan);
    setStartIdx(null);
    setEndIdx(null);
  };

  const handleDivideCell = () => {
    console.log("나누기");
  };

  if (position === null) return null;
  return (
    <ul className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      <li>
        {position.x}, {position.y}
      </li>
      <li onMouseDown={handleMergeCell}>합치기</li>
      <li onMouseDown={handleDivideCell}>나누기</li>
    </ul>
  );
}

export default ContextMenu;
