import { useCallback, useEffect, useState } from "react";
import Table from "./components/Table";
import { renderToStaticMarkup } from "react-dom/server";
import formatHtml from "./utils/formatHtml";

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

  useEffect(() => {
    const html = renderToStaticMarkup(
      <Table table={table} addRowColumn={addRowColumn} />
    );
    setHtmlString(html);
  }, [table]);

  return (
    <>
      <Table table={table} addRowColumn={addRowColumn} />
      <pre>{formatHtml(htmlString)}</pre>
    </>
  );
}

export default App;
