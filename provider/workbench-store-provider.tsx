'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type WorkbenchStore, createWorkbenchStore } from '@/store/workbench-store';

export type WorkbenchStoreApi = ReturnType<typeof createWorkbenchStore>

export const WorkbenchStoreContext = createContext<WorkbenchStoreApi | undefined>(
  undefined,
)

export interface WorkbenchStoreProviderProps {
  children: ReactNode
}

// Use React Context to keep only one and available in all server&client components of each request
export const WorkbenchStoreProvider = ({
  children,
}: WorkbenchStoreProviderProps) => {
  const storeRef = useRef<WorkbenchStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createWorkbenchStore()
  }

  return (
    <WorkbenchStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkbenchStoreContext.Provider>
  )
}

export const useWorkbenchStore = <T,>(
  selector: (store: WorkbenchStore) => T,
): T => {
  const workbenchStoreContext = useContext(WorkbenchStoreContext)

  if (!workbenchStoreContext) {
    throw new Error(`useWorkbenchStore must be used within WorkbenchStoreProvider`)
  }

  return useStore(workbenchStoreContext, selector)
}
