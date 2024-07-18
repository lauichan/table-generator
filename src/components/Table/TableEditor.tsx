import Table from "./Table";
import TableController from "./TableController";
import styles from "./TableEditor.module.css";

type TableEditorProps = {
  table: string[][];
  addRowColumn: (rowCount: number, columnCount: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
};

function TableEditor({ table, addRowColumn, setTableText }: TableEditorProps) {
  return (
    <>
      <TableController />
      <div className={styles.table}>
        <Table table={table} setTableText={setTableText} />
        <button className={styles.add_col} onClick={() => addRowColumn(0, 1)}>
          +
        </button>
        <button className={styles.add_row} onClick={() => addRowColumn(1, 0)}>
          +
        </button>
        <button
          className={styles.add_col_and_row}
          onClick={() => {
            addRowColumn(1, 1);
          }}
        >
          +
        </button>
      </div>
    </>
  );
}

export default TableEditor;
