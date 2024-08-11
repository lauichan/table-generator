import useTableOptions from "@hooks/useTableOptions";
import styles from "./TableOptions.module.css";

type TableOptionProps = {
  tableRowCol: { row: number; col: number };
};

function TableOptions({ tableRowCol }: TableOptionProps) {
  const { thead, tfoot, initTable, handleRow, handleCol, toggleTfoot, handleToggleThead } =
    useTableOptions(tableRowCol);

  return (
    <section>
      <form className={styles.controller}>
        <input placeholder="열" value={tableRowCol.row} onChange={handleRow} />
        <input placeholder="행" value={tableRowCol.col} onChange={handleCol} />
        <button type="button" onClick={initTable}>
          초기화
        </button>
      </form>
      <ul className={styles["option"]}>
        <li>
          <input id="thead" type="checkbox" checked={thead} onChange={handleToggleThead} />
          <label htmlFor="thead">머리글 사용</label>
        </li>
        <li>
          <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
          <label htmlFor="tfoot">바닥글 사용</label>
        </li>
      </ul>
    </section>
  );
}

export default TableOptions;
