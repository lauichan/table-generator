import { ChangeEvent } from "react";
import { useTableStore } from "../../store/useTableStore";
import sizeLimit from "../../utils/sizeLimit";
import styles from "./TableSizer.module.css";

type TableSizerProps = {
  tableRowCol: { row: number; col: number };
  setRowColumn: (rowCount: number, columnCount: number) => void;
};

function TableSizer({ tableRowCol, setRowColumn }: TableSizerProps) {
  const initTable = useTableStore((state) => state.initTable);

  const handleRow = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(sizeLimit(value, 2, 50) - tableRowCol.row, 0);
  };

  const handleCol = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(0, sizeLimit(value, 2, 50) - tableRowCol.col);
  };

  return (
    <form className={styles.controller}>
      <input placeholder="열" value={tableRowCol.row} onChange={handleRow} />
      <input placeholder="행" value={tableRowCol.col} onChange={handleCol} />
      <button type="button">생성</button>
      <button type="button" onClick={initTable}>
        초기화
      </button>
    </form>
  );
}

export default TableSizer;
