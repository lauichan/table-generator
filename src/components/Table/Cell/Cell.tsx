import type { FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject } from "react";
import type { CellType } from "../../../store/useTableStore";

import sanitizeHtml from "../../../utils/sanitizeHtml";
import styles from "./Cell.module.css";

type CellProps = CellType & {
  selected: boolean;
  cellRefs: MutableRefObject<HTMLTableCellElement[][]>;
  rowIdx: number;
  colIdx: number;
  handleFocusOut: (
    e: FocusEvent<HTMLTableCellElement, Element>,
    rowIdx: number,
    colIdx: number
  ) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleContextMenu: (e: MouseEvent<HTMLTableCellElement>) => void;
  handleMouseDown: (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleMouseUp: (e: MouseEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
};

function Cell({
  type,
  content,
  merged,
  selected,
  cellRefs,
  colIdx,
  rowIdx,
  handleFocusOut,
  handleKeyDown,
  handleContextMenu,
  handleMouseDown,
  handleMouseUp,
}: CellProps) {
  const commonProps = {
    ...(selected ? { className: styles["selected"] } : {}),
    ref: (el: HTMLTableCellElement) => {
      if (!cellRefs.current[rowIdx]) {
        cellRefs.current[rowIdx] = [];
      }
      cellRefs.current[rowIdx][colIdx] = el;
    },
    rowSpan: merged?.rowSpan,
    colSpan: merged?.colSpan,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: FocusEvent<HTMLTableCellElement>) => handleFocusOut(e, rowIdx, colIdx),
    onKeyDown: (e: KeyboardEvent<HTMLTableCellElement>) => handleKeyDown(e, rowIdx, colIdx),
    dangerouslySetInnerHTML: { __html: sanitizeHtml(content) },
    onMouseDown: (e: MouseEvent<HTMLTableCellElement>) => handleMouseDown(e, rowIdx, colIdx),
    onMouseUp: (e: MouseEvent<HTMLTableCellElement>) => handleMouseUp(e, rowIdx, colIdx),
    ...(selected ? { onContextMenu: handleContextMenu } : {}),
  };

  if (merged && merged.origin === false) return null;

  if (type === "head") return <th {...commonProps} />;

  return <td {...commonProps} />;
}

export default Cell;
