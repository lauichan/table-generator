import useManageTable from '@hooks/useManageTable';
import styles from './ContextMenu.module.css';

export type MousePosition = {
  x: number;
  y: number;
} | null;

type ContextMenuProps = {
  contextMenuRef: React.RefObject<HTMLUListElement>;
  position: MousePosition;
};

function ContextMenu({ contextMenuRef, position }: ContextMenuProps) {
  const {
    handleMergeCell,
    handleDivideCell,
    isSelecting,
    isSelectionMergeable,
    isSelectionDivisible,
    handleSetHeaderCell,
    handleSetDataCell,
  } = useManageTable();

  if (position === null) return null;

  return (
    <ul ref={contextMenuRef} className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      <li {...(isSelectionMergeable() ? { onClick: handleMergeCell } : { className: styles['disabled'] })}>합치기</li>
      <li {...(isSelectionDivisible() ? { onClick: handleDivideCell } : { className: styles['disabled'] })}>나누기</li>
      <li {...(isSelecting() ? { onClick: handleSetHeaderCell } : { className: styles['disabled'] })}>
        헤더셀로 바꾸기
      </li>
      <li {...(isSelecting() ? { onClick: handleSetDataCell } : { className: styles['disabled'] })}>
        데이터셀로 바꾸기
      </li>
    </ul>
  );
}

export default ContextMenu;
