import { useState } from "react";
import formatHtml from "./utils/formatHtml";
import TableEditor from "./components/Table/TableEditor";
import { createTableHtml } from "./utils/createHtml";

const initTable = [
  ["", ""],
  ["", ""],
];

function App() {
  const [table, setTable] = useState(initTable);

  const addRowColumn = (rowCount: number, columnCount: number) => {
    setTable((prevTable) => {
      const newTable = [...prevTable];
      for (let i = 0; i < rowCount; i++) {
        newTable.push(Array(newTable[0].length).fill(""));
      }
      for (let i = 0; i < newTable.length; i++) {
        for (let j = 0; j < columnCount; j++) {
          newTable[i].push("");
        }
      }
      return newTable;
    });
  };

  const setTableText = (rowIdx: number, colIdx: number, text: string) => {
    setTable((prevTable) => {
      const newTable = [...prevTable];
      newTable[rowIdx][colIdx] = text;
      return newTable;
    });
  };

  return (
    <main>
      <TableEditor table={table} addRowColumn={addRowColumn} setTableText={setTableText} />
      <pre>{formatHtml(createTableHtml(table))}</pre>
    </main>
  );
}

export default App;
