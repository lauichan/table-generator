import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  minified: boolean;
  thead: boolean;
  tfoot: boolean;
}

type Actions =  {
  toggleMinified: () => void;
  toggleThead: () => void;
  toggleTfoot: () => void;
}

export const useOptionStore = create<State & Actions>()(
  persist(
    (set) => ({
      minified: false,
      thead: false,
      tfoot: false,
      toggleMinified: () => {
        set((state) => ({ thead: !state.minified }));
      },
      toggleThead: () => {
        set((state) => ({ thead: !state.thead }));
      },
      toggleTfoot: () => {
        set((state) => ({ tfoot: !state.tfoot }));
      },
    }),
    {
      name: 'option',
      storage: createJSONStorage(() => sessionStorage),
    },
  )
)