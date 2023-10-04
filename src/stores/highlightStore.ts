import { create } from 'zustand'

type HighlightType =
  | [timeRange: string, fileId: number]
  | [timeRange: undefined, fileId: undefined]

type HighlightStore = {
  highlight: HighlightType
  setHighlight: (state: HighlightType) => void
}

const useHighlightStore = create<HighlightStore>()((set) => ({
  highlight: [undefined, undefined],
  setHighlight: ([timeRange, fileId]) =>
    set((state) => {
      if (timeRange === undefined && fileId === undefined) {
        return { highlight: [undefined, undefined] }
      } else return { highlight: [timeRange, fileId] }
    })
}))

export default useHighlightStore
