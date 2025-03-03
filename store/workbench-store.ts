import { create } from "zustand"

export type CircleRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WorkbenchState = {
  circleRect: CircleRect | undefined;
}

export type WorkbenchAction = {
  setCircleRect: (rect: CircleRect | undefined) => void;
};

export type WorkbenchStore = WorkbenchState & WorkbenchAction;

export const defaultInitState: WorkbenchState = {
  circleRect: undefined,
}
// A function with return create: because every request should create totally new store
export const createWorkbenchStore = (initState: WorkbenchState = defaultInitState) => {
  return create<WorkbenchStore>()((set) => ({
    ...initState,
    setCircleRect: (rect: CircleRect | undefined) => {
      set({circleRect: rect})
    },
  }));
};
