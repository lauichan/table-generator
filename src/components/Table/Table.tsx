import { KeyboardEvent, useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";

type TableProps = {
  table: string[][];
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
};

function Table({ table, setTableText }: TableProps) {
  const [isEditable, setEditable] = useState(false);
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleEditMode = () => {
    setEditable(true);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTableCellElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (e.key === "Enter") {
      setTableText(rowIdx, colIdx, e.currentTarget.innerText);
      setEditable(false);
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
                  key={`${rowIdx}-${colIdx}`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  onContextMenu={handleContextMenu}
                  onClick={handleEditMode}
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
