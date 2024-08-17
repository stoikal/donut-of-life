type Row =boolean[]

class GameOfLife {
  w: number
  h: number
  state: Row[]

  constructor (w: number, h: number) {
    this.w = w
    this.h = h
    this.state = this.#getInitialState()
  }

  #getInitialState() {
    return new Array(this.h)
      .fill(null)
      .map(() => new Array(this.w)
        .fill(null)
        .map(() => {
          return Math.random() >= 0.5
        })
      )
  }

  #getCellValue(x: number, y: number) {
    return this.state.at(x)?.at(y) ?? false
  }

  #getNeighbors(x: number, y: number){
    const n_ = this.#getCellValue(x, y - 1)
    const ne = this.#getCellValue(x + 1, y - 1)
    const e_ = this.#getCellValue(x + 1, y)
    const se = this.#getCellValue(x + 1, y + 1)
    const s_ = this.#getCellValue(x, y + 1)
    const sw = this.#getCellValue(x - 1, y + 1)
    const w_ = this.#getCellValue(x - 1, y)
    const nw = this.#getCellValue(x - 1, y - 1)

    return [n_, ne, e_, se, s_, sw, w_, nw]
  }

  #countAlive(arr: boolean[]) {
    return arr.filter(item => item).length
  }

  next() {
    this.state = this.state.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        const isCurrentlyAlive = col
        const neighbors = this.#getNeighbors(rowIndex, colIndex);
        const neighborCount = this.#countAlive(neighbors)

        let lives = false

        if (neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive)) {
          lives = true
        }

        return lives
      })
    })

    return this.state
  }
}

export default GameOfLife