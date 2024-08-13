import useManageTable from "@hooks/useManageTable";
import styles from "./ContextMenu.module.css";

export type MousePosition = {
  x: number;
  y: number;
} | null;

type ContextMenuProps = {
  contextMenuRef: React.RefObject<HTMLUListElement>;
  position: MousePosition;
};

function ContextMenu({ contextMenuRef, position }: ContextMenuProps) {
  const { handleMergeCell, handleDivideCell, isSelectionMergeable, isSelectionDivisible } =
    useManageTable();

  if (position === null) return null;

  const hasMenuItems = isSelectionMergeable() || isSelectionDivisible();
  if (!hasMenuItems) return null;

  return (
    <ul
      ref={contextMenuRef}
      className={styles.context_menu}
      style={{ top: position.y, left: position.x }}
    >
      {isSelectionMergeable() ? <li onClick={handleMergeCell}>합치기</li> : null}
      {isSelectionDivisible() ? <li onClick={handleDivideCell}>나누기</li> : null}
    </ul>
  );
}

export default ContextMenu;
