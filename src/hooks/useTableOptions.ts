import type { ChangeEvent } from 'react';

import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useTableStore } from '@store/useTableStore';
import sizeLimit from '@utils/sizeLimit';
import { useSelectCellsStore } from '@store/useSelectCellsStore';

const MIN_TABLE_SIZE = 2;
const MAX_TABLE_SIZE = 20;

const useTableOptions = (tableRowCol: { row: number; col: number }) => {
  const [table, toggleHeadType, initTable, setRowColumn] = useTableStore(
    useShallow((state) => [state.table, state.toggleHeadType, state.initTable, state.setRowColumn]),
  );

  const [thead, tfoot, setThead, setTfoot] = useOptionStore(
    useShallow((state) => [state.thead, state.tfoot, state.setThead, state.setTfoot]),
  );

  const setSelectRange = useSelectCellsStore((state) => state.setSelectRange);

  const hasMergedCell = (type: 'head' | 'foot', rowIndex: number): boolean => {
    const rowIdx = type === 'head' ? 0 : rowIndex;
    for (let i = rowIdx; i < rowIndex; i++) {
      for (let j = 0; j < table[0].length; j++) {
        const mergedCell = table[i][j].merged;
        if (mergedCell && mergedCell.rowIdx + mergedCell.rowSpan > rowIndex) return true;
      }
    }
    return false;
  };

  const handleSetThead = (e: ChangeEvent<HTMLInputElement>) => {
    const value = sizeLimit(Number(e.target.value), 0, table.length - tfoot);

    if (hasMergedCell('head', value)) {
      alert(`머리글 셀들은 머리글 끼리 합칠 수 있습니다.\n수직으로 확장된 셀을 나눠주세요.`);
      return;
    }

    setThead(value);
    toggleHeadType(value);
  };

  const handleSetTfoot = (e: ChangeEvent<HTMLInputElement>) => {
    const value = sizeLimit(Number(e.target.value), 0, table.length - thead);

    if (hasMergedCell('foot', value)) {
      alert(`바닥글 셀들은 바닥글 끼리 합칠 수 있습니다.\n수직으로 확장된 셀을 나눠주세요.`);
      return;
    }

    setTfoot(sizeLimit(value, 0, table.length - thead));
  };

  const handleRow = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(sizeLimit(value, MIN_TABLE_SIZE, MAX_TABLE_SIZE) - tableRowCol.row, 0);
  };

  const handleCol = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setRowColumn(0, sizeLimit(value, MIN_TABLE_SIZE, MAX_TABLE_SIZE) - tableRowCol.col);
  };

  const handleInitTable = () => {
    setSelectRange(null);
    setThead(0);
    setTfoot(0);
    initTable();
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
