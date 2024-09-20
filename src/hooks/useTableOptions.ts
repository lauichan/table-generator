import type { ChangeEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOptionStore } from '@store/useOptionStore';
import { useTableStore } from '@store/useTableStore';
import sizeLimit from '@utils/sizeLimit';
import { useSelectCellsStore } from '@store/useSelectCellsStore';
import { TABLE_SIZE } from '@/constants/constants';

const useTableOptions = (tableRowCol: { row: number; col: number }) => {
  const { table, mergedList, toggleHeadType, initTable, setRow, setColumn } = useTableStore(
    useShallow((state) => ({
      table: state.table,
      mergedList: state.mergedList,
      toggleHeadType: state.toggleHeadType,
      initTable: state.initTable,
      setRow: state.setRow,
      setColumn: state.setColumn,
    })),
  );

  const { thead, tfoot, setThead, setTfoot } = useOptionStore(
    useShallow((state) => ({
      thead: state.thead,
      tfoot: state.tfoot,
      setThead: state.setThead,
      setTfoot: state.setTfoot,
    })),
  );

  const setSelectRange = useSelectCellsStore((state) => state.setSelectRange);

  const hasMergedCell = (type: 'head' | 'foot', rows: number): boolean => {
    const startRow = type === 'head' ? rows : table.length - rows;

    for (const { rowIdx, rowSpan } of mergedList) {
      if (startRow > rowIdx && startRow <= rowIdx + rowSpan) return true;
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
    setRow(sizeLimit(value, TABLE_SIZE.MIN, TABLE_SIZE.MAX) - tableRowCol.row);
  };

  const handleCol = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number(e.target.value);
    setColumn(sizeLimit(value, TABLE_SIZE.MIN, TABLE_SIZE.MAX) - tableRowCol.col, thead);
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
