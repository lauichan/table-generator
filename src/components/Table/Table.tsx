import { FocusEvent, KeyboardEvent, useRef, useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";
import { useTableStore } from "../../store/useTableStore";
import htmlEscape from "../../utils/htmlEscape";
import sanitizeHtml from "../../utils/sanitizeHtml";

function Table({ table }: { table: string[][] }) {
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);
  const setTableText = useTableStore((state) => state.setTableText);
  const thead = useTableStore((state) => state.thead);
  const tfoot = useTableStore((state) => state.tfoot);
  const tbody = thead
    ? tfoot
      ? table.slice(1, table.length - 1)
      : table.slice(1)
    : tfoot
    ? table.slice(0, table.length - 1)
    : table;

  // const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
  //   e.preventDefault();
  //   setContextMenu({
  //     x: e.pageX,
  //     y: e.pageY,
  //   });
  // };

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
        {thead ? (
          <thead>
            <tr>
              {table[0].map((col, colIdx) => (
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
                  // onContextMenu={handleContextMenu}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(col) }}
                />
              ))}
            </tr>
          </thead>
        ) : (
          <></>
        )}
        <tbody>
          {tbody.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              {row.map((column, colIdx) => (
                <td
                  ref={(el: HTMLTableCellElement) => {
                    if (!cellRefs.current[rowIdx + (thead ? 1 : 0)]) {
                      cellRefs.current[rowIdx + (thead ? 1 : 0)] = [];
                    }
                    cellRefs.current[rowIdx + (thead ? 1 : 0)][colIdx] = el;
                  }}
                  key={`${rowIdx}-${colIdx}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleFocusOut(e, rowIdx + (thead ? 1 : 0), colIdx)}
                  onKeyDown={(e) => handleKeyDown(e, rowIdx + (thead ? 1 : 0), colIdx)}
                  // onContextMenu={handleContextMenu}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(column) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
        {tfoot ? (
          <tfoot>
            <tr>
              {table.slice(-1)[0].map((col, colIdx) => (
                <td
                  ref={(el: HTMLTableCellElement) => {
                    if (!cellRefs.current[table.length - 1]) {
                      cellRefs.current[table.length - 1] = [];
                    }
                    cellRefs.current[table.length - 1][colIdx] = el;
                  }}
                  key={`footer-${colIdx}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleFocusOut(e, table.length - 1, colIdx)}
                  onKeyDown={(e) => handleKeyDown(e, table.length - 1, colIdx)}
                  // onContextMenu={handleContextMenu}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(col) }}
                />
              ))}
            </tr>
          </tfoot>
        ) : (
          <></>
        )}
      </table>
      {contextMenu && <ContextMenu position={contextMenu} />}
    </>
  );
}

export default Table;
