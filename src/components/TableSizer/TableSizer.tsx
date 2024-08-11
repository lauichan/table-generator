import { useTableStore } from "@store/useTableStore";
import styles from "./TableSizer.module.css";

function TableSizer() {
  const setRowColumn = useTableStore((state) => state.setRowColumn);

  return (
    <>
      <button className={styles["right"]} onClick={() => setRowColumn(0, 1)}>
        +
      </button>
      <button className={styles["bottom"]} onClick={() => setRowColumn(1, 0)}>
        +
      </button>
      <button className={styles["bottom-right"]} onClick={() => setRowColumn(1, 1)}>
        +
      </button>
    </>
  );
}

export default TableSizer;
