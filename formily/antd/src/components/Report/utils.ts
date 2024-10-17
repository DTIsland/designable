const ABCMap = {
  // Map 0 to A, 1 to B, 2 to C, ...
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
}

export function getCellName(row: number, col: number) {
  return `${ABCMap[col]}${row + 1}`
}

export function getRowName(row: number) {
  return `Row${row + 1}`
}
