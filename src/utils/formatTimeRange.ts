import getTimeRangeNumberArray from './getTimeRangeNumberArray'

function formatTimeRange(timeRange: string): string {
  const regex = /\d+:\d+/g

  if (!regex.test(timeRange)) return 'Błąd formatowania'

  return getTimeRangeNumberArray(timeRange.split(':'))
    .map((number) => formatTime(number))
    .join(' : ')
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export default formatTimeRange
