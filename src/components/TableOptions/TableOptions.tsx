import useTableOptions from '@hooks/useTableOptions';
import useManageTable from '@hooks/useManageTable';
import styles from './TableOptions.module.css';

type TableOptionProps = {
  tableRowCol: { row: number; col: number };
};

function TableOptions({ tableRowCol }: TableOptionProps) {
  const { thead, tfoot, handleRow, handleCol, handleSetThead, handleSetTfoot, handleInitTable } =
    useTableOptions(tableRowCol);

  const { handleMergeCell, handleDivideCell, isSelectionMergeable, isSelectionDivisible, handleToggleCellType } =
    useManageTable();

  return (
    <section className={styles['controller']}>
      <div className={styles['row']}>
        <input id="row" type="number" placeholder="행" value={tableRowCol.row} onChange={handleRow} />
        <label htmlFor="row">행</label>
      </div>
      <div className={styles['col']}>
        <input id="col" type="number" placeholder="열" value={tableRowCol.col} onChange={handleCol} />
        <label htmlFor="col">열</label>
      </div>
      <button type="button" onClick={handleInitTable} title="2행 2열 빈값으로 초기화">
        초기화
      </button>
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
      <button type="button" onClick={handleToggleCellType}>
        헤더/데이터셀 바꾸기
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
    </section>
  );
}

export default TableOptions;
