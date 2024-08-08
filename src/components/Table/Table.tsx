import type { CellType } from "../../store/useTableStore";
import type { FocusEvent } from "react";

import Cell from "./Cell/Cell";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useShallow } from "zustand/react/shallow";
import { useOptionStore } from "../../store/useOptionStore";
import { useTableStore } from "../../store/useTableStore";
import useContextMenu from "../../hooks/useContextMenu";
import useSelectCells from "../../hooks/useSelectCells";
import useArrowNavigate from "../../hooks/useArrowNavigate";
import htmlEscape from "../../utils/htmlEscape";
import isSelectedCell from "../../utils/isSelectedCell";

function Table({ table }: { table: CellType[][] }) {
  const { contextMenuRef, handleContextMenu, contextMenu } = useContextMenu();
  const { range, handleMouseDown, handleMouseUp } = useSelectCells(table);
  const { cellRefs, handleKeyDown } = useArrowNavigate(table);
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

  const commonProps = {
    cellRefs: cellRefs,
    handleFocusOut: handleFocusOut,
    handleKeyDown: handleKeyDown,
    handleContextMenu: handleContextMenu,
    handleMouseDown: handleMouseDown,
    handleMouseUp: handleMouseUp,
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
                  selected={isSelectedCell(range, 0, colIdx)}
                  rowIdx={0}
                  colIdx={colIdx}
                  {...commonProps}
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
                  selected={isSelectedCell(range, rowIdx, colIdx)}
                  rowIdx={rowIdx + (thead ? 1 : 0)}
                  colIdx={colIdx}
                  {...commonProps}
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
                  selected={isSelectedCell(range, table.length - 1, colIdx)}
                  rowIdx={table.length - 1}
                  colIdx={colIdx}
                  {...commonProps}
                />
              ))}
            </tr>
          </tfoot>
        ) : (
          <></>
        )}
      </table>
      {contextMenu && <ContextMenu position={contextMenu} />}
      {JSON.stringify(range)}
    </>
  );
}

export default Table;
