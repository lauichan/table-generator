import { useEffect } from "react";
import { useTableStore } from "@store/useTableStore";
import TableOption from "@components/TableOption/TableOption";
import Table from "@components/Table/Table";
import TableSizer from "@components/TableSizer/TableSizer";
import PreviewCode from "@components/PreviewCode/PreviewCode";

function App() {
  const table = useTableStore((state) => state.table);
  const tableRowCol = { row: table.length, col: table[0].length };

  useEffect(() => {
    document.oncontextmenu = function () {
      return false;
    };
  }, []);

  return (
    <main>
      <TableOption tableRowCol={tableRowCol} />
      <section className="table">
        <Table table={table} />
        <TableSizer />
      </section>
      <PreviewCode table={table} />
    </main>
  );
}

export default App;
