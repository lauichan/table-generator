import { useState } from "react";
import Table from "./components/Table";

const initTable = [
  ["", ""],
  ["", ""],
];

function App() {
  const [table, setTable] = useState(initTable);

  const addRow = (count: number) => {
    setTable((prevTable) => {
      const newTable = [...prevTable];
      for (let i = 0; i < count; i++) {
        newTable.push(Array(newTable[0].length).fill(""));
      }
      return newTable;
    });
  };

  const addColumn = (count: number) => {
    setTable((prevTable) => {
      return prevTable.map((row) => {
        const newRow = [...row];
        for (let i = 0; i < count; i++) {
          newRow.push("");
        }
        return newRow;
      });
    });
  };

  return <Table table={table} addRow={addRow} addColumn={addColumn} />;
}

export default App;
