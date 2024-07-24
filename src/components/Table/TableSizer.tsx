import { ChangeEvent } from "react";
import styles from "./TableSizer.module.css";
import { useTableStore } from "../../store/useTableStore";

type TableSizerProps = {
  tableRowCol: { row: number; col: number };
  setRowColumn: (rowCount: number, columnCount: number) => void;
};

const sizeLimit = (size: number) => {
  if (size < 2) return 2;
  if (size > 50) return 50;
  return size;
};

function TableSizer({ tableRowCol, setRowColumn }: TableSizerProps) {
  const initTable = useTableStore((state) => state.initTable);

  const handleRow = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(sizeLimit(value) - tableRowCol.row, 0);
  };

  const handleCol = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(0, sizeLimit(value) - tableRowCol.col);
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
