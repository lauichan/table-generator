import { useTableStore } from '@store/useTableStore';
import Table from '@components/Table/Table';
import PreviewCode from '@components/PreviewCode/PreviewCode';
import TableOptions from '@components/TableOptions/TableOptions';

function App() {
  const table = useTableStore((state) => state.table);
  const tableRowCol = { row: table.length, col: table[0].length };

  return (
    <main>
      <TableOptions tableRowCol={tableRowCol} />
      <Table table={table} />
      <PreviewCode table={table} />
    </main>
  );
}

export default App;
