const bs = require("binary-search")

export default function makeSortedList<T>(compare: (target: T, needle: T) => number) {
  const list: T[] = []

  return {
    add: (node: T) => {
      let index = bs(list, node, compare)

      if (index < 0) {
        index = Math.abs(index) - 1
      }

      list.splice(index, 0, node)
    },
    list,
  }
}
