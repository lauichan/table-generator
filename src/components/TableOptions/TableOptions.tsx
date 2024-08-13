import useTableOptions from "@hooks/useTableOptions";
import useManageTable from "@hooks/useManageTable";
import styles from "./TableOptions.module.css";

type TableOptionProps = {
  tableRowCol: { row: number; col: number };
};

function TableOptions({ tableRowCol }: TableOptionProps) {
  const { thead, tfoot, initTable, handleRow, handleCol, toggleTfoot, handleToggleThead } =
    useTableOptions(tableRowCol);

  const { handleMergeCell, handleDivideCell, isSelectionMergeable, isSelectionDivisible } =
    useManageTable();

  return (
    <section className={styles.controller}>
      <input placeholder="열" value={tableRowCol.row} onChange={handleRow} />
      X
      <input placeholder="행" value={tableRowCol.col} onChange={handleCol} />
      <button type="button" onClick={initTable}>
        초기화
      </button>
      <div>
        <input id="thead" type="checkbox" checked={thead} onChange={handleToggleThead} />
        <label htmlFor="thead">머리글 사용</label>
      </div>
      <div>
        <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
        <label htmlFor="tfoot">바닥글 사용</label>
      </div>
      <button type="button" onClick={handleMergeCell} disabled={!isSelectionMergeable()}>
        합치기
      </button>
      <button type="button" onClick={handleDivideCell} disabled={!isSelectionDivisible()}>
        나누기
      </button>
    </section>
  );
}

export default TableOptions;
