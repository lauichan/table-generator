import useTableOptions from '@hooks/useTableOptions';
import useManageTable from '@hooks/useManageTable';
import styles from './TableOptions.module.css';

type TableOptionProps = {
  tableRowCol: { row: number; col: number };
};

function TableOptions({ tableRowCol }: TableOptionProps) {
  const { thead, tfoot, handleRow, handleCol, handleSetThead, handleSetTfoot, handleInitTable } =
    useTableOptions(tableRowCol);

  const {
    handleMergeCell,
    handleDivideCell,
    isConvertible,
    isSelectionMergeable,
    isSelectionDivisible,
    handleSetHeaderCell,
    handleSetDataCell,
    handleClearCells,
  } = useManageTable();

  return (
    <section className={styles['controller']}>
      <div className={styles['table-format']}>
        <div className={styles['size']}>
          <input type="number" placeholder="행" value={tableRowCol.row} onChange={handleRow} />
          <span>X</span>
          <input type="number" placeholder="열" value={tableRowCol.col} onChange={handleCol} />
        </div>
        <button type="button" onClick={handleInitTable} title="2행 2열 빈값으로 초기화">
          초기화
        </button>
        <div className={styles['thead']}>
          <label htmlFor="thead" title="<thead> 머리글 사용하기">
            머리글
          </label>
          <input id="thead" type="number" value={thead} onChange={handleSetThead} />
        </div>
        <div className={styles['tfoot']}>
          <label htmlFor="tfoot" title="<tfoot> 바닥글 사용하기">
            바닥글
          </label>
          <input id="tfoot" type="number" value={tfoot} onChange={handleSetTfoot} />
        </div>
      </div>
      <div className={styles['table-manager']}>
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
        <button type="button" onClick={handleSetHeaderCell} disabled={!isConvertible()}>
          헤더셀로 바꾸기
        </button>
        <button type="button" onClick={handleSetDataCell} disabled={!isConvertible()}>
          데이터셀로 바꾸기
        </button>
        <button type="button" onClick={handleClearCells}>
          내용 비우기
        </button>
      </div>
    </section>
  );
}

export default TableOptions;
