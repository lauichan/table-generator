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
      <input placeholder="행" value={tableRowCol.row} onChange={handleRow} />행
      <input placeholder="열" value={tableRowCol.col} onChange={handleCol} />열
      <button type="button" onClick={initTable} title="2행 2열 빈값으로 초기화">
        초기화
      </button>
      <div>
        <input id="thead" type="checkbox" checked={thead} onChange={handleToggleThead} />
        <label htmlFor="thead" title="<thead> 머리글 사용하기">
          머리글 사용
        </label>
      </div>
      <div>
        <input id="tfoot" type="checkbox" checked={tfoot} onChange={toggleTfoot} />
        <label htmlFor="tfoot" title="<tfoot> 바닥글 사용하기">
          바닥글 사용
        </label>
      </div>
      <button
        type="button"
        onClick={handleMergeCell}
        disabled={!isSelectionMergeable()}
        title="합치고 싶은 셀들을 드래그로 선택해주세요"
      >
        합치기
      </button>
      <button
        type="button"
        onClick={handleDivideCell}
        disabled={!isSelectionDivisible()}
        title="나누고 싶은 셀을 선택해주세요"
      >
        나누기
      </button>
    </section>
  );
}

export default TableOptions;
