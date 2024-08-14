import { useReducer, type ChangeEvent } from "react";

import { useShallow } from "zustand/react/shallow";
import { useOptionStore } from "@store/useOptionStore";
import { useTableStore } from "@store/useTableStore";
import sizeLimit from "@utils/sizeLimit";

const useTableOptions = (tableRowCol: { row: number; col: number }) => {
  const [table, toggleHeadType, initTable, setRowColumn] = useTableStore(
    useShallow((state) => [state.table, state.toggleHeadType, state.initTable, state.setRowColumn])
  );

  const [thead, tfoot, setThead, setTfoot] = useOptionStore(
    useShallow((state) => [state.thead, state.tfoot, state.setThead, state.setTfoot])
  );

  const hasTheadRowSpan = (): boolean => {
    for (let i = 0; i < thead; i++) {
      for (let j = 0; j < table[0].length; j++) {
        const mergedCell = table[i][j].merged;
        if (mergedCell && mergedCell.rowIdx + mergedCell.rowSpan > thead) return true;
      }
    }
    return false;
  };

  const handleSetThead = (e: ChangeEvent<HTMLInputElement>) => {
    if (hasTheadRowSpan()) {
      alert(`머리글 셀들은 머리글 끼리 합칠 수 있습니다.\n수직으로 확장된 셀을 나눠주세요.`);
      return;
    }
    const value = sizeLimit(Number(e.target.value), 0, table.length - tfoot);
    setThead(value);
    toggleHeadType(value);
  };

  const handleSetTfoot = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTfoot(sizeLimit(value, 0, table.length - thead));
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

  const handleInitTable = () => {
    initTable();
    setThead(0);
    setTfoot(0);
  };

  return {
    thead,
    tfoot,
    handleRow,
    handleCol,
    handleSetThead,
    handleSetTfoot,
    handleInitTable,
  };
};

export default useTableOptions;
