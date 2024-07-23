import Table from "./Table";
import TableSizer from "./TableSizer";
import styles from "./TableEditor.module.css";
import { useTableStore } from "../../store/useTableStore";

function TableEditor() {
  const table = useTableStore((state) => state.table);
  const setRowColumn = useTableStore((state) => state.setRowColumn);
  const tableRowCol = { row: table.length, col: table[0].length };

  return (
    <>
      <TableSizer tableRowCol={tableRowCol} setRowColumn={setRowColumn} />
      <div className={styles.table}>
        <Table table={table} />
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
