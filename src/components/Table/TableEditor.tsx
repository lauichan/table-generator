import Table from "./Table";
import TableSizer from "./TableSizer";
import styles from "./TableEditor.module.css";

type TableEditorProps = {
  table: string[][];
  setRowColumn: (rowCount: number, columnCount: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
};

function TableEditor({ table, setRowColumn, setTableText }: TableEditorProps) {
  const tableRowCol = { row: table.length, col: table[0].length };

  return (
    <>
      <TableSizer tableRowCol={tableRowCol} setRowColumn={setRowColumn} />
      <div className={styles.table}>
        <Table table={table} setTableText={setTableText} />
        <button className={styles["right"]} onClick={() => setRowColumn(0, 1)}>
          +
        </button>
        <button className={styles["bottom"]} onClick={() => setRowColumn(1, 0)}>
          +
        </button>
        <button className={styles["bottom-right"]} onClick={() => setRowColumn(1, 1)}>
          +
        </button>
      </div>
    </>
  );
}

export default TableEditor;
