import type { ChangeEvent } from "react";

import { useShallow } from "zustand/react/shallow";
import { useTableStore } from "@store/useTableStore";
import { useOptionStore } from "@store/useOptionStore";
import sizeLimit from "@utils/sizeLimit";
import styles from "./TableOption.module.css";

type TableOptionProps = {
  tableRowCol: { row: number; col: number };
};

function TableOption({ tableRowCol }: TableOptionProps) {
  const [table, toggleHeadType, initTable, setRowColumn] = useTableStore(
    useShallow((state) => [state.table, state.toggleHeadType, state.initTable, state.setRowColumn])
  );

  const [thead, tfoot, toggleThead, toggleTfoot] = useOptionStore(
    useShallow((state) => [state.thead, state.tfoot, state.toggleThead, state.toggleTfoot])
  );

  const hasTheadRowSpan = (): boolean => {
    for (let i = 0; i < table[0].length; i++) {
      const mergedCell = table[0][i].merged;
      if (mergedCell && mergedCell.rowSpan) return true;
    }
    return false;
  };

  const handleToggleThead = () => {
    if (hasTheadRowSpan()) {
      alert(`머리글 셀들은 수직으로 확장할 수 없습니다.\n수직으로 확장된 셀을 나눠주세요`);
      return;
    }
    toggleThead();
    toggleHeadType(thead ? "define" : "head");
  };

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

export default TableOption;
