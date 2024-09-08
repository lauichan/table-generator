import type { SelectRange } from './useSelectCellsStore';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MergedCell = {
  rowIdx: number;
  colIdx: number;
  rowSpan: number;
  colSpan: number;
};

export type CellInfo = {
  type: 'define' | 'head';
  content: string;
  merged: MergedCell | null;
};

type State = {
  table: CellInfo[][];
  mergedList: MergedCell[];
};

type Actions = {
  initTable: () => void;
  setRowColumn: (rowCount: number, columnCount: number, thead?: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
  toggleHeadType: (thead: number) => void;
  mergeCells: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => void;
  divideCell: (rowIdx: number, colIdx: number) => void;
  setHeaderCells: (range: SelectRange) => void;
  setDataCells: (range: SelectRange) => void;
};

const initTable: CellInfo[][] = [
  [
    { type: 'define', content: '', merged: null },
    { type: 'define', content: '', merged: null },
  ],
  [
    { type: 'define', content: '', merged: null },
    { type: 'define', content: '', merged: null },
  ],
];

export const useTableStore = create<State & Actions>()(
  persist(
    (set) => ({
      table: initTable,
      mergedList: [],
      initTable: () => {
        set({ table: initTable, mergedList: [] });
      },
      setRowColumn: (rowCount, columnCount, thead = 0) => {
        set(({ table }) => {
          const newTable: CellInfo[][] = structuredClone(table);
          if (rowCount >= 0 && columnCount >= 0) {
            for (let i = 0; i < rowCount; i++) {
              newTable.push(Array(newTable[0].length).fill({ type: 'define', content: '', merged: null }));
            }
            newTable.forEach((row, rowIdx) => {
              for (let j = 0; j < columnCount; j++) {
                if (thead > 0 && thead - 1 === rowIdx) {
                  row.push({ type: 'head', content: '', merged: null });
                } else {
                  row.push({ type: 'define', content: '', merged: null });
                }
              }
            });
          } else {
            for (let i = 0; i < -1 * rowCount; i++) {
              newTable.pop();
            }
            newTable.forEach((row) => {
              for (let j = 0; j < -1 * columnCount; j++) row.pop();
            });
          }
          return { table: newTable };
        });
      },
      setTableText: (rowIdx, colIdx, text) => {
        set(({ table }) => {
          const newTable = table.map((row, rIdx) =>
            row.map((cell, cIdx) => (rIdx === rowIdx && cIdx === colIdx ? { ...cell, content: text } : cell)),
          );
          return { table: newTable };
        });
      },
      toggleHeadType: (thead) => {
        set(({ table }) => {
          const newTable: CellInfo[][] = table.map((row, rowIdx) =>
            row.map((cell) => ({
              ...cell,
              type: thead > 0 && rowIdx < thead ? 'head' : 'define',
            })),
          );
          return { table: newTable };
        });
      },
      mergeCells: (rowIdx, colIdx, rowSpan, colSpan) => {
        set(({ table, mergedList }) => {
          const newTable: CellInfo[][] = structuredClone(table);

          let content = '';

          for (let i = 0; i <= rowSpan; i++) {
            for (let j = 0; j <= colSpan; j++) {
              if (i === 0 && j === 0) continue;
              content += newTable[rowIdx + i][colIdx + j].content;
              newTable[rowIdx + i][colIdx + j] = {
                ...newTable[rowIdx + i][colIdx + j],
                content: '',
                merged: {
                  rowIdx,
                  colIdx,
                  rowSpan: rowSpan + 1,
                  colSpan: colSpan + 1,
                },
              };
            }
          }

          newTable[rowIdx][colIdx] = {
            ...newTable[rowIdx][colIdx],
            content: newTable[rowIdx][colIdx].content + content,
            merged: {
              rowIdx,
              colIdx,
              rowSpan: rowSpan + 1,
              colSpan: colSpan + 1,
            },
          };

          const filteredMergedList = mergedList.filter(
            (mergedCell) =>
              !(
                mergedCell.rowIdx >= rowIdx &&
                mergedCell.rowIdx < rowIdx + rowSpan + 1 &&
                mergedCell.colIdx >= colIdx &&
                mergedCell.colIdx < colIdx + colSpan + 1
              ),
          );

          const newMergedList = [...filteredMergedList, { rowIdx, colIdx, rowSpan, colSpan }];
          return { table: newTable, mergedList: newMergedList };
        });
      },
      divideCell: (rowIdx, colIdx) => {
        set(({ table, mergedList }) => {
          const newTable = structuredClone(table);

          const { rowSpan, colSpan } = newTable[rowIdx][colIdx].merged!;
          for (let i = 0; i < rowSpan; i++) {
            for (let j = 0; j < colSpan; j++) {
              newTable[rowIdx + i][colIdx + j] = {
                ...newTable[rowIdx + i][colIdx + j],
                merged: null,
              };
            }
          }

          const newMergedList = mergedList.filter(({ rowIdx: r, colIdx: c }) => !(rowIdx === r && colIdx === c));
          return { table: newTable, mergedList: newMergedList };
        });
      },
      setHeaderCells: (range) => {
        set(({ table }) => {
          const newTable = updateCellType(table, range, 'head');
          return { table: newTable };
        });
      },
      setDataCells: (range) => {
        set(({ table }) => {
          const newTable = updateCellType(table, range, 'define');
          return { table: newTable };
        });
      },
    }),
    {
      name: 'table',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const updateCellType = (table: CellInfo[][], range: SelectRange, type: CellInfo['type']): CellInfo[][] => {
  if (!range) return table;
  const { startRow, startCol, endRow, endCol } = range;
  const newTable: CellInfo[][] = table.map((row, rIdx) =>
    row.map((cell, cIdx) => {
      if (rIdx >= startRow && rIdx <= endRow && cIdx >= startCol && cIdx <= endCol) {
        return { ...cell, type };
      }
      return cell;
    }),
  );
  return newTable;
};
