import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LayoutOrientation = 'horizontal' | 'vertical';

export interface ILayoutConfig {
  orientation: LayoutOrientation;
  isHorizontal: () => boolean;
  isVertical: () => boolean;
  setOrientation: (orientation: LayoutOrientation) => void;
}

export const useLayoutStore = create<ILayoutConfig>()(
  persist(
    (set, get) => ({
      orientation: 'horizontal',
      isHorizontal: () => get().orientation === 'horizontal',
      isVertical: () => get().orientation === 'vertical',
      setOrientation: (orientation) => set({ orientation }),
    }),
    {
      name: 'app-layout-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
