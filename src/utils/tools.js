export function tableSort(arr, key, ascending) {
  const multiplier = ascending ? 1 : -1
  return [...arr].sort((prev, curr) => {
    const a = String(prev[key])
    const b = String(curr[key])
    return a.localeCompare(b) * multiplier
  })
}

export const debouncer = (() => {
  let timer = 0
  return (callback, ms) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
