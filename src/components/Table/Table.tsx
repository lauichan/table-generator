import { useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";

function Table({ table }: { table: string[][] }) {
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  return (
    <>
      <table>
        <tbody>
          {table.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              {row.map((column, colIdx) => (
                <td
                  key={`${rowIdx}-${colIdx}`}
                  onContextMenu={handleContextMenu}
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
