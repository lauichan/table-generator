import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CellType = {
  type: "define" | "head" | "merged";
  content: string;
  merged?: {
    originalCell: {
      rowIdx: number;
      colIdx: number;
    };
    rowSpan: number;
    colSpan: number;
  };
};

type State = {
  table: CellType[][];
};

type Actions = {
  initTable: () => void;
  setRowColumn: (rowCount: number, columnCount: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
  toggleHeadType: (type: CellType["type"]) => void;
  toggleCellType: (rowIdx: number, colIdx: number, type: CellType["type"]) => void;
  setSpan: (rowIdx: number, colIdx: number, rowSpan: number, colSpan: number) => void;
};

const initTable: CellType[][] = [
  [
    { type: "define", content: "" },
    { type: "define", content: "" },
  ],
  [
    { type: "define", content: "" },
    { type: "define", content: "" },
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
      setRowColumn: (rowCount, columnCount) => {
        set(({ table }) => {
          const newTable: CellType[][] = structuredClone(table);
          if (rowCount >= 0 && columnCount >= 0) {
            for (let i = 0; i < rowCount; i++) {
              newTable.push(Array(newTable[0].length).fill({ type: "define", content: "" }));
            }
            newTable.forEach((row) => {
              for (let j = 0; j < columnCount; j++) row.push({ type: "define", content: "" });
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
      toggleHeadType: (type) => {
        set(({ table }) => {
          const newTable = table.map((row, rIdx) =>
            rIdx === 0 ? row.map((cell) => ({ ...cell, type })) : row
          );
          return { table: newTable };
        });
      },
      toggleCellType: (rowIdx, colIdx, type) => {
        set(({ table }) => {
          const newTable = table.map((row, rIdx) =>
            rIdx === rowIdx
              ? row.map((cell, cIdx) => (cIdx === colIdx ? { ...cell, type } : cell))
              : row
          );
          return { table: newTable };
        });
      },
      setSpan: (rowIdx, colIdx, rowSpan, colSpan) => {
        set(({ table }) => {
          const newTable = structuredClone(table);
          newTable[rowIdx][colIdx] = {
            ...newTable[rowIdx][colIdx],
            merged: {
              originalCell: { rowIdx, colIdx },
              rowSpan,
              colSpan,
            },
          };
          for (let i = 1; i <= rowSpan; i++) {
            newTable[rowIdx + i][colIdx] = {
              ...newTable[rowIdx + i][colIdx],
              type: "merged",
            };
          }
          for (let i = 1; i <= colSpan; i++) {
            newTable[rowIdx][colIdx + 1] = {
              ...newTable[rowIdx][colIdx + 1],
              type: "merged",
            };
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
