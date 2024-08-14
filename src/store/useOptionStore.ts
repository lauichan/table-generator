import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  minified: boolean;
  thead: number;
  tfoot: number;
};

type Actions = {
  toggleMinified: () => void;
  setThead: (row: number) => void;
  setTfoot: (row: number) => void;
};

export const useOptionStore = create<State & Actions>()(
  persist(
    (set) => ({
      minified: false,
      thead: 0,
      tfoot: 0,
      toggleMinified: () => {
        set((state) => ({ minified: !state.minified }));
      },
      setThead: (row: number) => {
        set({ thead: row });
      },
      setTfoot: (row: number) => {
        set({ tfoot: row });
      },
    }),
    {
      name: "option",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
