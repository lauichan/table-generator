import { useTableStore } from "@store/useTableStore";
import styles from "./TableSizer.module.css";

function TableSizer() {
  const setRowColumn = useTableStore((state) => state.setRowColumn);

  return (
    <>
      <button className={styles["right"]} onClick={() => setRowColumn(0, 1)} title="열 추가">
        +
      </button>
      <button className={styles["bottom"]} onClick={() => setRowColumn(1, 0)} title="행 추가">
        +
      </button>
      <button
        className={styles["bottom-right"]}
        onClick={() => setRowColumn(1, 1)}
        title="행 열 1 추가"
      >
        +
      </button>
    </>
  );
}

export default TableSizer;
