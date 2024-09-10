import { useTableStore } from '@store/useTableStore';
import Table from '@components/Table/Table';
import PreviewCode from '@components/PreviewCode/PreviewCode';
import TableOptions from '@components/TableOptions/TableOptions';

function App() {
  const table = useTableStore((state) => state.table);
  const tableRowCol = { row: table.length, col: table[0].length };

  return (
    <div className="container">
      <header>
        <h1>Table HTML Generator</h1>
        <ul>
          <li>
            <a href="#preview">미리보기</a>
          </li>
        </ul>
      </header>
      <main>
        <section>
          <TableOptions tableRowCol={tableRowCol} />
          <Table table={table} />
        </section>
        <section>
          <PreviewCode table={table} />
        </section>
      </main>
      <footer>
        <a href="https://github.com/lauichan">lauichan</a>
      </footer>
    </div>
  );
}

export default App;
