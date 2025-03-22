import { create } from "zustand"

export type CircleRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageData = {
  /* current base64 */
  current: string;
  histories: string[];
  /* current index of histories */
  currentIndex: number;
};

export type WorkbenchState = {
  circleRect: CircleRect | undefined;
  imageData: ImageData;
}

export type WorkbenchAction = {
  setCircleRect: (rect: CircleRect | undefined) => void;
  setImageAction: (imageBase64: string) => void;
  resetImageAction: () => void;
  undoImageAction: () => void;
  redoImageAction: () => void;
};

export type WorkbenchStore = WorkbenchState & WorkbenchAction;

type InitialWorkbenchState = {
  circleRect?: CircleRect;
  imageBase64?: string;
};
const defaultInitState: InitialWorkbenchState = {
  circleRect: undefined,
  imageBase64: '',
}


// A function with return create: because every request should create totally new store
export const createWorkbenchStore = (initState: InitialWorkbenchState = defaultInitState) => {
  const { imageBase64 = '' } = initState;
  return create<WorkbenchStore>()((set) => {
    return {
      circleRect: undefined,
      imageData: {
        current: imageBase64,
        histories: [],
        currentIndex: -1,
      },
      setCircleRect: (rect: CircleRect | undefined) => {
        set((state) => ({ ...state, circleRect: rect }));
      },
      setImageAction: (imageBase64: string) => {
        set((state) => ({
          ...state,
          imageData: {
            current: imageBase64,
            histories: [imageBase64, ...state.imageData.histories.slice(0, 10)],
            currentIndex: 0,
          }
        }));
      },
      resetImageAction: () => {
        set((state) => ({
          ...state,
          imageData: {
            current: '',
            histories: [],
            currentIndex: -1,
          }
        }));
      },
      undoImageAction: () => {
        set((state) => {
          if (state.imageData.currentIndex >= state.imageData.histories.length - 1) {
            return state;
          }
          const newIndex = state.imageData.currentIndex + 1;
          return {
            ...state,
            imageData: {
              ...state.imageData,
              current: state.imageData.histories[newIndex],
              currentIndex: newIndex,
            }
          };
        });
      },
      redoImageAction: () => {
        set((state) => {
          if (state.imageData.currentIndex < 1) {
            return state;
          }
          const newIndex = state.imageData.currentIndex - 1;
          return {
            ...state,
            imageData: {
              ...state.imageData,
              current: state.imageData.histories[newIndex],
              currentIndex: newIndex,
            }
          };
        });
      },
    };
  });
};
