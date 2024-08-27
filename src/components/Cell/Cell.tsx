import type { FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject } from 'react';
import type { CellInfo } from '@store/useTableStore';

import sanitizeHtml from '@utils/sanitizeHtml';
import styles from './Cell.module.css';

type CellProps = {
  cellRefs: MutableRefObject<HTMLTableCellElement[][]>;
  cell: CellInfo;
  selected: boolean;
  rowIdx: number;
  colIdx: number;
  handleFocusOut: (e: FocusEvent<HTMLTableCellElement, Element>, rowIdx: number, colIdx: number) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleContextMenu: (e: MouseEvent<HTMLTableCellElement>) => void;
  handleMouseDown: (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleMouseOver: (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleMouseUp: () => void;
};

function Cell({
  cellRefs,
  cell,
  selected,
  colIdx,
  rowIdx,
  handleFocusOut,
  handleKeyDown,
  handleContextMenu,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
}: CellProps) {
  const { type, content, merged } = cell;

  const commonProps = {
    ref: (el: HTMLTableCellElement) => {
      if (!cellRefs.current[rowIdx]) cellRefs.current[rowIdx] = [];
      cellRefs.current[rowIdx][colIdx] = el;
    },
    ...(merged ? { rowSpan: merged.rowSpan, colSpan: merged.colSpan } : {}),
    contentEditable: true,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: { __html: sanitizeHtml(content) },
    ...(selected ? { className: styles['selected'], onContextMenu: handleContextMenu } : {}),
    onBlur: (e: FocusEvent<HTMLTableCellElement>) => handleFocusOut(e, rowIdx, colIdx),
    onKeyDown: (e: KeyboardEvent<HTMLTableCellElement>) => handleKeyDown(e, rowIdx, colIdx),
    onMouseDown: (e: MouseEvent<HTMLTableCellElement>) => handleMouseDown(e, rowIdx, colIdx),
    onMouseOver: (e: MouseEvent<HTMLTableCellElement>) => handleMouseOver(e, rowIdx, colIdx),
    onMouseUp: handleMouseUp,
  };

  const isMergedCell = merged && (merged.rowIdx !== rowIdx || merged.colIdx !== colIdx);
  if (isMergedCell) return null;

  if (type === 'head') return <th {...commonProps} />;
  return <td {...commonProps} />;
}

export default Cell;
