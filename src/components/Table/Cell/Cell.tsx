import { FocusEvent, KeyboardEvent, MutableRefObject } from "react";
import sanitizeHtml from "../../../utils/sanitizeHtml";
import { useOptionStore } from "../../../store/useOptionStore";
import type { CellType } from "../../../store/useTableStore";

type CellProps = CellType & {
  cellRefs: MutableRefObject<HTMLTableCellElement[][]>;
  rowIdx: number;
  colIdx: number;
  handleFocusOut: (
    e: FocusEvent<HTMLTableCellElement, Element>,
    rowIdx: number,
    colIdx: number
  ) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTableCellElement>, rowIdx: number, colIdx: number) => void;
  handleContextMenu: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void;
};

function Cell({
  type,
  content,
  cellRefs,
  colIdx,
  rowIdx,
  handleFocusOut,
  handleKeyDown,
  handleContextMenu,
}: CellProps) {
  const thead = useOptionStore((state) => state.thead);
  const cellRefIdx = rowIdx + (thead ? 1 : 0);

  if (type === "merged") return null;

  if (type === "head")
    return (
      <th
        ref={(el: HTMLTableCellElement) => {
          if (!cellRefs.current[0]) {
            cellRefs.current[0] = [];
          }
          cellRefs.current[0][colIdx] = el;
        }}
        key={`header-${colIdx}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleFocusOut(e, 0, colIdx)}
        onKeyDown={(e) => handleKeyDown(e, 0, colIdx)}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        onContextMenu={handleContextMenu}
      />
    );

  return (
    <td
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
    />
  );
}

export default Cell;
