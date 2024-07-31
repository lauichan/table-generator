import { FocusEvent, KeyboardEvent, useRef } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import { type CellType, useTableStore } from "../../store/useTableStore";
import { useOptionStore } from "../../store/useOptionStore";
import htmlEscape from "../../utils/htmlEscape";
import Cell from "./Cell/Cell";
import useContextMenu from "../../hooks/useContextMenu";
import { useShallow } from "zustand/react/shallow";

function Table({ table }: { table: CellType[][] }) {
  const { contextMenuRef, handleContextMenu, contextMenu } = useContextMenu();
  const [thead, tfoot] = useOptionStore(useShallow((state) => [state.thead, state.tfoot]));
  const setTableText = useTableStore((state) => state.setTableText);

  const tbody = table.slice(thead ? 1 : 0, tfoot ? -1 : table.length);

  const handleFocusOut = (
    e: FocusEvent<HTMLTableCellElement, Element>,
    rowIdx: number,
    colIdx: number
  ) => {
    const text = htmlEscape(e.currentTarget.innerText);
    setTableText(rowIdx, colIdx, text);
  };

  const cellRefs = useRef<HTMLTableCellElement[][]>([]);

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
