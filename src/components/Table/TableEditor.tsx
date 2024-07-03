import Table from "./Table";
import styles from "./TableEditor.module.css";

type TableProps = {
  table: string[][];
  addRowColumn: (rowCount: number, columnCount: number) => void;
};

function TableEditor({ table, addRowColumn }: TableProps) {
  return (
    <div className={styles.table}>
      <Table table={table} />
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
  );
}

export default TableEditor;
