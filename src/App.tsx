import { useState } from "react";
import formatHtml from "./utils/formatHtml";
import createTableHtml from "./utils/createHtml";
import TableEditor from "./components/Table/TableEditor";

const initTable = [
  ["", ""],
  ["", ""],
];

function App() {
  const [table, setTable] = useState(initTable);

  const setRowColumn = (rowCount: number, columnCount: number) => {
    setTable((prevTable) => {
      const newTable: string[][] = structuredClone(prevTable);
      if (rowCount >= 0 && columnCount >= 0) {
        for (let i = 0; i < rowCount; i++) {
          newTable.push(Array(newTable[0].length).fill(""));
        }
        newTable.forEach((row) => {
          for (let j = 0; j < columnCount; j++) row.push("");
        });
        return newTable;
      } else {
        for (let i = 0; i < -1 * rowCount; i++) {
          newTable.pop();
        }
        newTable.forEach((row) => {
          for (let j = 0; j < -1 * columnCount; j++) row.pop();
        });
        return newTable;
      }
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
      <TableEditor table={table} setRowColumn={setRowColumn} setTableText={setTableText} />
      <pre>{formatHtml(createTableHtml(table))}</pre>
    </main>
  );
}

export default App;
