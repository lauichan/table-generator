import type { SelectedRange } from "./useSelectCellsStore";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CellType = {
  type: "define" | "head";
  content: string;
  merged: {
    origin: boolean;
    rowIdx: number;
    colIdx: number;
    rowSpan: number;
    colSpan: number;
  } | null;
};

type State = {
  table: CellType[][];
};

type Actions = {
  initTable: () => void;
  setRowColumn: (rowCount: number, columnCount: number, thead?: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
  toggleHeadType: (thead: number) => void;
  toggleCellsType: (startIdx: SelectedRange, colIdx: SelectedRange) => void;
  mergeCells: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => void;
  divideCell: (rowIdx: number, colIdx: number) => void;
};

const initTable: CellType[][] = [
  [
    { type: "define", content: "", merged: null },
    { type: "define", content: "", merged: null },
  ],
  [
    { type: "define", content: "", merged: null },
    { type: "define", content: "", merged: null },
  ],
];

export const useTableStore = create<State & Actions>()(
  persist(
    (set) => ({
      table: initTable,
      selectedCells: null,
      initTable: () => {
        set({ table: initTable });
      },
      setRowColumn: (rowCount, columnCount, thead = 0) => {
        set(({ table }) => {
          const newTable: CellType[][] = structuredClone(table);
          if (rowCount >= 0 && columnCount >= 0) {
            for (let i = 0; i < rowCount; i++) {
              newTable.push(
                Array(newTable[0].length).fill({ type: "define", content: "", merged: null })
              );
            }
            newTable.forEach((row, rowIdx) => {
              for (let j = 0; j < columnCount; j++) {
                if (thead > 0 && thead - 1 === rowIdx) {
                  row.push({ type: "head", content: "", merged: null });
                } else {
                  row.push({ type: "define", content: "", merged: null });
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
            row.map((cell, cIdx) =>
              rIdx === rowIdx && cIdx === colIdx ? { ...cell, content: text } : cell
            )
          );
          return { table: newTable };
        });
      },
      toggleHeadType: (thead) => {
        set(({ table }) => {
          const newTable: CellType[][] = table.map((row, rowIdx) =>
            row.map((cell) => ({
              ...cell,
              type: thead > 0 && rowIdx < thead ? "head" : "define",
            }))
          );
          return { table: newTable };
        });
      },
      toggleCellsType: (startIdx, endIdx) => {
        set(({ table }) => {
          const { row: sRow, col: sCol } = startIdx!;
          const { row: eRow, col: eCol } = endIdx!;
          const newTable: CellType[][] = table.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              if (rIdx >= sRow && rIdx <= eRow && cIdx >= sCol && cIdx <= eCol) {
                return { ...cell, type: cell.type === "define" ? "head" : "define" };
              }
              return cell;
            })
          );
          return { table: newTable };
        });
      },
      mergeCells: (rowIdx, colIdx, rowSpan, colSpan) => {
        set(({ table }) => {
          const newTable: CellType[][] = structuredClone(table);

          let content = "";

          for (let i = 0; i <= rowSpan; i++) {
            for (let j = 0; j <= colSpan; j++) {
              if (i === 0 && j === 0) continue;
              content += newTable[rowIdx + i][colIdx + j].content;
              newTable[rowIdx + i][colIdx + j] = {
                ...newTable[rowIdx + i][colIdx + j],
                content: "",
                merged: {
                  origin: false,
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
              origin: true,
              rowIdx,
              colIdx,
              rowSpan: rowSpan + 1,
              colSpan: colSpan + 1,
            },
          };

          return { table: newTable };
        });
      },
      divideCell: (rowIdx, colIdx) => {
        set(({ table }) => {
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

          return { table: newTable };
        });
      },
    }),
    {
      name: "table",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
