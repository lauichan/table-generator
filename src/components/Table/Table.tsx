import { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";
import { type CellType, useTableStore } from "../../store/useTableStore";
import { useOptionStore } from "../../store/useOptionStore";
import htmlEscape from "../../utils/htmlEscape";
import Cell from "./Cell/Cell";

function Table({ table }: { table: CellType[][] }) {
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);
  const setTableText = useTableStore((state) => state.setTableText);
  const thead = useOptionStore((state) => state.thead);
  const tfoot = useOptionStore((state) => state.tfoot);
  const tbody = thead
    ? tfoot
      ? table.slice(1, table.length - 1)
      : table.slice(1)
    : tfoot
    ? table.slice(0, table.length - 1)
    : table;

  const contextMenuRef = useRef<HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

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
      <table ref={contextMenuRef}>
        {thead ? (
          <thead>
            <tr>
              {table[0].map((cell, colIdx) => (
                <Cell
                  key={`header-${colIdx}`}
                  {...cell}
                  cellRefs={cellRefs}
                  rowIdx={0}
                  colIdx={colIdx}
                  handleFocusOut={handleFocusOut}
                  handleKeyDown={handleKeyDown}
                  handleContextMenu={handleContextMenu}
                />
              ))}
            </tr>
          </thead>
        ) : (
          <></>
        )}
        <tbody>
          {tbody.map((row, rowIdx) => (
            <tr key={`tbody-${rowIdx}`}>
              {row.map((cell, colIdx) => (
                <Cell
                  key={`tbody-${rowIdx}-${colIdx}`}
                  {...cell}
                  cellRefs={cellRefs}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  handleFocusOut={handleFocusOut}
                  handleKeyDown={handleKeyDown}
                  handleContextMenu={handleContextMenu}
                />
              ))}
            </tr>
          ))}
        </tbody>
        {tfoot ? (
          <tfoot>
            <tr>
              {table.slice(-1)[0].map((cell, colIdx) => (
                <Cell
                  key={`tfoot-${colIdx}`}
                  {...cell}
                  cellRefs={cellRefs}
                  rowIdx={table.length - 1}
                  colIdx={colIdx}
                  handleFocusOut={handleFocusOut}
                  handleKeyDown={handleKeyDown}
                  handleContextMenu={handleContextMenu}
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
