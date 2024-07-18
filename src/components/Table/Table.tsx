import { useState } from "react";
import ContextMenu, { MousePosition } from "../ContextMenu/ContextMenu";

type TableProps = {
  table: string[][];
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
};

function Table({ table, setTableText }: TableProps) {
  const [contextMenu, setContextMenu] = useState<MousePosition>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const [isEditable, setEditable] = useState(false);

  const handleEditMode = () => {
    setEditable(true);
  };

  const handleInput = (
    event: React.FormEvent<HTMLTableCellElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    const target = event.currentTarget;
    setTableText(rowIdx, colIdx, target.innerText);
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
                  onInput={(event) => handleInput(event, rowIdx, colIdx)}
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
