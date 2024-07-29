import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  table: string[][];
  thead: boolean;
  tfoot: boolean;
}

type Actions =  {
  initTable: () => void;
  setRowColumn: (rowCount: number, columnCount: number) => void;
  setTableText: (rowIdx: number, colIdx: number, text: string) => void;
  toggleThead: () => void;
  toggleTfoot: () => void;
}

const initTable = [
  ["", ""],
  ["", ""],
];

export const useTableStore = create<State & Actions>()(
  persist(
    (set) => ({
      table: initTable,
      thead: false,
      tfoot: false,
      initTable: () => {
        set({table: initTable})
      },
      setRowColumn: (rowCount: number, columnCount: number) => {
        set(({table}) => {
          const newTable: string[][] = structuredClone(table);
          if (rowCount >= 0 && columnCount >= 0) {
            for (let i = 0; i < rowCount; i++) {
              newTable.push(Array(newTable[0].length).fill(""));
            }
            newTable.forEach((row) => {
              for (let j = 0; j < columnCount; j++) row.push("");
            });
          } else {
            for (let i = 0; i < -1 * rowCount; i++) {
              newTable.pop();
            }
            newTable.forEach((row) => {
              for (let j = 0; j < -1 * columnCount; j++) row.pop();
            });
          }
          return {table: newTable};
        })
      },
      setTableText: (rowIdx: number, colIdx: number, text: string) => {
        set(({table}) => {
          const newTable = table.map((row, rIdx) =>
            row.map((cell, cIdx) => (rIdx === rowIdx && cIdx === colIdx ? text : cell))
          );
          return { table: newTable };
        })
      },
      toggleThead: () => {
        set((state) => ({ thead: !state.thead }));
      },
      toggleTfoot: () => {
        set((state) => ({ tfoot: !state.tfoot }));
      },
    }),
    {
      name: 'table',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)