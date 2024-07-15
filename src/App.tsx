import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import formatHtml from "./utils/formatHtml";
import TableEditor from "./components/Table/TableEditor";
import Table from "./components/Table/Table";

const initTable = [
  ["", ""],
  ["", ""],
];

function App() {
  const [table, setTable] = useState(initTable);
  const [htmlString, setHtmlString] = useState<string>("");

  const addRowColumn = (rowCount: number, columnCount: number) => {
    setTable((prevTable) => {
      const newTable = [...prevTable];
      for (let i = 0; i < rowCount; i++) {
        newTable.push(Array(newTable[0].length).fill(""));
      }
      return newTable;
    });
    setTable((prevTable) => {
      return prevTable.map((row) => {
        const newRow = [...row];
        for (let i = 0; i < columnCount; i++) {
          newRow.push("");
        }
        return newRow;
      });
    });
  };

  return (
    <>
      <TableEditor table={table} addRowColumn={addRowColumn} />
      <pre>html 표시할 부분</pre>
    </>
  );
}

export default App;
