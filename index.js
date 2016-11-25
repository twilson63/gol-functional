'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// const { times, equals, nth, compose,
//   update, gt, lt, and, not, __, map, addIndex,
//   sum, add, subtract, tap, flatten
// } = require('ramda')

var _require = require('fun-fp'),
    times = _require.times,
    equals = _require.equals,
    byIndex = _require.byIndex,
    compose = _require.compose,
    update = _require.update,
    gt = _require.gt,
    lt = _require.lt,
    and = _require.and,
    not = _require.not,
    map = _require.map,
    addIndex = _require.addIndex,
    sum = _require.sum,
    add = _require.add,
    subtract = _require.subtract,
    flatten = _require.flatten,
    curry = _require.curry,
    reduce = _require.reduce;

// get random integer function


var randomInt = require('random-int');
// create a declarative set of functions for finding neighbors
// const [top, left, bottom, right] = [
//   subtract(__, 1), subtract(__, 1), add(__, 1), add(__, 1)
// ]

var mapIndex = addIndex(map);
var curryMap = curry(map);

/*
settings:

- size: default 20
- generate: true | false
- speed: 1000
*/
var sim = function sim(_ref, onTick) {
  var _ref$size = _ref.size,
      size = _ref$size === undefined ? 20 : _ref$size,
      _ref$generate = _ref.generate,
      generate = _ref$generate === undefined ? true : _ref$generate,
      _ref$speed = _ref.speed,
      speed = _ref$speed === undefined ? 1000 : _ref$speed;

  var running = false;
  // create board
  var board = times(function (n) {
    return times(createCell, size);
  }, size);
  // handle game tick
  //   notify new board for redraw
  function tick() {
    // process board
    board = mapIndex(function (v, row) {
      return mapIndex(function (value, col) {
        var alive = equals(1, value);
        var n = neighbors(row, col);
        // 3 neighbors and not alive
        if (and(equals(n, 3), not(alive))) return 1;

        // less than 2 neighbors and alive - decease
        if (and(lt(n, 2), alive)) return 0;

        // if 2 neighbors and alive then keep alive
        if (and(equals(n, 2), alive)) return 1;

        // if 3 neighbors and alive then keep alive
        if (and(equals(n, 3), alive)) return 1;

        // if more than 3 neighbors and alive then decease
        if (and(gt(n, 3), alive)) return 0;

        // otherwise return existing value
        return value;
      }, v);
    }, board);

    if (onTick) onTick(board);
    console.log(active());
    if (and(running, active())) {
      setTimeout(tick, speed);
    }
  }
  // console.log(board)
  return {
    start: start,
    stop: stop,
    toggle: toggle,
    tick: tick
  };

  function start() {
    running = true;
    setTimeout(tick, speed);
  }

  function stop() {
    running = false;
  }

  function toggle(row, col) {
    var canToggle = and(not(running), inBoard(size)(row, col));

    if (canToggle) {
      var value = equals(1, byIndex(col, byIndex(row, board))) ? 0 : 1;
      board = updateCell(board, row, col, value);
    }

    onTick(board);

    return board;
  }

  function createCell() {
    return generate ? randomInt(0, 1) : 0;
  }

  function updateCell(board, row, col, value) {
    var newRow = compose(update(col, value), byIndex(row))(board);

    return update(row, newRow, board);
  }

  function inBoard(size) {
    return function (row, col) {
      return and(and(gt(row, -1), gt(col, -1)), and(lt(row, size), lt(col, size)));
    };
  }

  function getValue(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        row = _ref3[0],
        col = _ref3[1];

    return inBoard(size)(row, col) ? byIndex(col, byIndex(row, board)) : 0;
  }

  function active() {
    return gt(reduce(function (acc, v) {
      return acc + sum(v);
    }, 0, board), 0);
  }

  function neighbors(row, col) {
    return sum(map(getValue, [[subtract(row, 1), subtract(col, 1)], [subtract(row, 1), col], [subtract(row, 1), add(col, 1)], [row, subtract(col, 1)], [row, add(col, 1)], [add(row, 1), subtract(col, 1)], [add(row, 1), col], [add(row, 1), add(col, 1)]]));
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
};

module.exports = sim;
