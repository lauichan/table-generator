import useManageTable from "@hooks/useManageTable";
import styles from "./ContextMenu.module.css";

export type MousePosition = {
  x: number;
  y: number;
} | null;

type ContextMenuProps = {
  position: MousePosition;
};

function ContextMenu({ position }: ContextMenuProps) {
  const { handleMergeCell, handleDivideCell, isSelectionMergeable, isSelectionDivisible } =
    useManageTable();

  if (position === null) return null;

  return (
    <ul className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      {isSelectionMergeable() ? <li onMouseDown={handleMergeCell}>합치기</li> : null}
      {isSelectionDivisible() ? <li onMouseDown={handleDivideCell}>나누기</li> : null}
    </ul>
  );
}

export default ContextMenu;
