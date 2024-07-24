import { FocusEvent, KeyboardEvent, useRef, useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";
import { useTableStore } from "../../store/useTableStore";
import htmlEscape from "../../utils/htmlEscape";
import sanitizeHtml from "../../utils/sanitizeHtml";

type TableProps = {
  table: string[][];
};

function Table({ table }: TableProps) {
  const setTableText = useTableStore((state) => state.setTableText);
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleFocusOut = (
    e: FocusEvent<HTMLTableCellElement, Element>,
    rowIdx: number,
    colIdx: number
  ) => {
    const text = htmlEscape(e.currentTarget.innerText);
    setTableText(rowIdx, colIdx, text);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTableCellElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (e.key === "ArrowRight") {
      if (colIdx < table[0].length - 1) {
        cellRefs.current[rowIdx][colIdx + 1].focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (colIdx > 0) {
        cellRefs.current[rowIdx][colIdx - 1].focus();
      }
    } else if (e.key === "ArrowDown") {
      if (rowIdx < table.length - 1) {
        cellRefs.current[rowIdx + 1][colIdx].focus();
      }
    } else if (e.key === "ArrowUp") {
      if (rowIdx > 0) {
        cellRefs.current[rowIdx - 1][colIdx].focus();
      }
    }
  };

  return (
    <>
      <table>
        <tbody>
          {table.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              {row.map((column, colIdx) => (
                <td
                  ref={(el: HTMLTableCellElement) => {
                    if (!cellRefs.current[rowIdx]) {
                      cellRefs.current[rowIdx] = [];
                    }
                    cellRefs.current[rowIdx][colIdx] = el;
                  }}
                  key={`${rowIdx}-${colIdx}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleFocusOut(e, rowIdx, colIdx)}
                  onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                  onContextMenu={handleContextMenu}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(column) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {contextMenu && <ContextMenu position={contextMenu} />}
    </>
  );
}

export default Table;
