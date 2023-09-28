import { create } from 'zustand'

type GlobalStore = {
  highlight: string | undefined
  setHighlight: (state: string | undefined) => void
}

const useGlobalStore = create<GlobalStore>()((set) => ({
  highlight: undefined,
  setHighlight: (timeRange) => set((state) => ({ highlight: timeRange }))
}))

export default useGlobalStore
