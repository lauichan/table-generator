import { FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject } from "react";
import sanitizeHtml from "../../../utils/sanitizeHtml";
import { useOptionStore } from "../../../store/useOptionStore";
import type { CellType } from "../../../store/useTableStore";
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
  const thead = useOptionStore((state) => state.thead);
  const cellRefIdx = rowIdx + (thead ? 1 : 0);

  if (type === "merged") return null;

  if (type === "head")
    return (
      <th
        className={selected ? styles["selected"] : styles["unselected"]}
        ref={(el: HTMLTableCellElement) => {
          if (!cellRefs.current[rowIdx]) {
            cellRefs.current[rowIdx] = [];
          }
          cellRefs.current[rowIdx][colIdx] = el;
        }}
        key={`header-${colIdx}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleFocusOut(e, rowIdx, colIdx)}
        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        onContextMenu={handleContextMenu}
        onMouseDown={(e) => handleMouseDown(e, rowIdx, colIdx)}
        onMouseUp={(e) => handleMouseUp(e, rowIdx, colIdx)}
      />
    );

  return (
    <td
      className={selected ? styles["selected"] : styles["unselected"]}
      ref={(el: HTMLTableCellElement) => {
        if (!cellRefs.current[cellRefIdx]) {
          cellRefs.current[cellRefIdx] = [];
        }
        cellRefs.current[cellRefIdx][colIdx] = el;
      }}
      key={`${rowIdx}-${colIdx}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => handleFocusOut(e, cellRefIdx, colIdx)}
      onKeyDown={(e) => handleKeyDown(e, cellRefIdx, colIdx)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      onContextMenu={handleContextMenu}
      onMouseDown={(e) => handleMouseDown(e, rowIdx, colIdx)}
      onMouseUp={(e) => handleMouseUp(e, rowIdx, colIdx)}
    />
  );
}

export default Cell;
