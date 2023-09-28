function getTimeRangeNumberArray(timeRangeStringArray: string[]): number[] {
  return timeRangeStringArray.map((value) => Number(value))
}

export default getTimeRangeNumberArray
