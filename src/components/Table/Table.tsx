import { KeyboardEvent, useRef, useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";

type TableProps = {
  table: string[][];
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
};

function Table({ table, setTableText }: TableProps) {
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
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

    if (e.key === "Enter") {
      e.preventDefault();
      setTableText(rowIdx, colIdx, e.currentTarget.innerText);
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
                  onContextMenu={handleContextMenu}
                  onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                >
                  {column}
                </td>
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
