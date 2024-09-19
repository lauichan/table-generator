import useManageTable from '@hooks/useManageTable';
import styles from './ContextMenu.module.css';
import { useSelectCellsStore } from '@store/useSelectCellsStore';

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
    isConvertible,
    isSelectionMergeable,
    isSelectionDivisible,
    handleSetHeaderCell,
    handleSetDataCell,
    handleClearCells,
  } = useManageTable();
  const selectRange = useSelectCellsStore((state) => state.selectRange);

  if (!position || !selectRange) return null;

  return (
    <ul ref={contextMenuRef} className={styles.context_menu} style={{ top: position.y, left: position.x }}>
      <li {...(isSelectionMergeable() ? { onClick: handleMergeCell } : { className: styles['disabled'] })}>합치기</li>
      <li {...(isSelectionDivisible() ? { onClick: handleDivideCell } : { className: styles['disabled'] })}>나누기</li>
      <li {...(isConvertible() ? { onClick: handleSetHeaderCell } : { className: styles['disabled'] })}>
        헤더셀로 바꾸기
      </li>
      <li {...(isConvertible() ? { onClick: handleSetDataCell } : { className: styles['disabled'] })}>
        데이터셀로 바꾸기
      </li>
      <li onClick={handleClearCells}>내용 비우기</li>
    </ul>
  );
}

export default ContextMenu;
