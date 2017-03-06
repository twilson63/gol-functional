// const { times, equals, nth, compose,
//   update, gt, lt, and, not, __, map, addIndex,
//   sum, add, subtract, tap, flatten
// } = require('ramda')

const { times, equals, byIndex, compose,
update, gt, lt, and, not, map, addindex,
sum, add, subtract, flatten, curry, reduce } = require('fun-fp')

// get random integer function
const randomInt = require('random-int')
// create a declarative set of functions for finding neighbors
// const [top, left, bottom, right] = [
//   subtract(__, 1), subtract(__, 1), add(__, 1), add(__, 1)
// ]

const mapIndex = addindex(map)
const curryMap = curry(map)

/*
settings:

- size: default 20
- generate: true | false
- speed: 1000
*/
const sim = ({size=20, generate=true, speed=1000}, onTick) => {
  let running = false
  // create board
  let board = times(n => times(createCell, size), size)
  // handle game tick
  //   notify new board for redraw
  function tick () {
    // process board
    board = mapIndex(
      (v, row) => mapIndex((value, col) => {
        const alive = equals(1, value)
        const n = neighbors(row, col)
        // 3 neighbors and not alive
        if (and(equals(n,3), not(alive))) return 1

        // less than 2 neighbors and alive - decease
        if (and(lt(n,2), alive)) return 0

        // if 2 neighbors and alive then keep alive
        if (and(equals(n,2), alive)) return 1

        // if 3 neighbors and alive then keep alive
        if (and(equals(n,3), alive)) return 1

        // if more than 3 neighbors and alive then decease
        if (and(gt(n,3), alive)) return 0

        // otherwise return existing value
        return value
      }, v),
      board
    )

    if (onTick) onTick(board)
    console.log(active())
    if (and(running, active())) {
      setTimeout(tick, speed)
    }
  }
  // console.log(board)
  return {
    start: start,
    stop: stop,
    toggle: toggle,
    tick: tick
  }

  function start () {
    running = true
    setTimeout(tick, speed)
  }

  function stop () {
    running = false
  }

  function toggle (row, col) {
    const canToggle = and(
      not(running),
      inBoard(size)(row, col)
    )

    if (canToggle) {
      let value = equals(1, byIndex(col, byIndex(row, board))) ? 0 : 1
      board = updateCell(board, row, col, value)
    }

    onTick(board)

    return board
  }

  function createCell () {
    return generate ? randomInt(0,1) : 0
  }

  function updateCell(board, row, col, value) {
    const newRow =  compose(
      update(col, value),
      byIndex(row)
    )(board)

    return update(row, newRow, board)
  }

  function inBoard(size) {
    return (row, col) =>
      and(
        and(gt(row, -1), gt(col, -1)),
        and(lt(row, size), lt(col, size))
      )
  }

  function getValue ([row, col]) {
    return inBoard(size)(row,col) ? byIndex(col, byIndex(row, board)) : 0
  }

  function active () {
    return gt(reduce((acc,v) => acc + sum(v), 0, board), 0)
  }

  function neighbors(row, col) {
    return sum(map(getValue, [
      [subtract(row, 1), subtract(col, 1)],
      [subtract(row, 1), col],
      [subtract(row, 1), add(col, 1)],
      [row, subtract(col, 1)],
      [row, add(col, 1)],
      [add(row, 1), subtract(col, 1)],
      [add(row, 1), col],
      [add(row, 1), add(col, 1)]
    ]))
  }
  // function neighbors (row, col) {
  //   return compose(
  //     sum,
  //     map(getValue)
  //   )([
  //     [top(row), left(col)],
  //     [top(row), col],
  //     [top(row), right(col)],
  //     [row, left(col)],
  //     [row, right(col)],
  //     [bottom(row), left(col)],
  //     [bottom(row), col],
  //     [bottom(row), right(col)]
  //   ])
  // }
}

module.exports = sim
