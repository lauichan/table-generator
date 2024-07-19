import { ChangeEvent } from "react";
import styles from "./TableSizer.module.css";

type TableSizerProps = {
  tableRowCol: { row: number; col: number };
  setRowColumn: (rowCount: number, columnCount: number) => void;
};

const checkSizeLimit = (size: number) => {
  console.log(size);
  if (size > 0 && size < 100) return true;
  return false;
};

function TableSizer({ tableRowCol, setRowColumn }: TableSizerProps) {
  const handleRow = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    if (!checkSizeLimit(value)) return;
    setRowColumn(value - tableRowCol.row, 0);
  };

  const handleCol = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    if (!checkSizeLimit(value)) return;
    setRowColumn(0, value - tableRowCol.col);
  };

  return (
    <form className={styles.controller}>
      <input placeholder="열" value={tableRowCol.row} onChange={handleRow} required></input>
      <input placeholder="행" value={tableRowCol.col} onChange={handleCol} required></input>
      <button>생성</button>
    </form>
  );
}

export default TableSizer;
