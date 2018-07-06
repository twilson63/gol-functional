'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// get random integer function


var _ramda = require('ramda');

var _randomInt = require('random-int');

var _randomInt2 = _interopRequireDefault(_randomInt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapIndex = addindex(_ramda.map);
var curryMap = curry(_ramda.map);

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
  var board = (0, _ramda.times)(function (n) {
    return (0, _ramda.times)(createCell, size);
  }, size);
  // handle game tick
  //   notify new board for redraw
  function tick() {
    // process board
    board = mapIndex(function (v, row) {
      return mapIndex(function (value, col) {
        var alive = (0, _ramda.equals)(1, value);
        var n = neighbors(row, col);
        // 3 neighbors and not alive
        if ((0, _ramda.and)((0, _ramda.equals)(n, 3), (0, _ramda.not)(alive))) return 1;

        // less than 2 neighbors and alive - decease
        if ((0, _ramda.and)((0, _ramda.lt)(n, 2), alive)) return 0;

        // if 2 neighbors and alive then keep alive
        if ((0, _ramda.and)((0, _ramda.equals)(n, 2), alive)) return 1;

        // if 3 neighbors and alive then keep alive
        if ((0, _ramda.and)((0, _ramda.equals)(n, 3), alive)) return 1;

        // if more than 3 neighbors and alive then decease
        if ((0, _ramda.and)((0, _ramda.gt)(n, 3), alive)) return 0;

        // otherwise return existing value
        return value;
      }, v);
    }, board);

    if (onTick) onTick(board);
    console.log(active());
    if ((0, _ramda.and)(running, active())) {
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
    var canToggle = (0, _ramda.and)((0, _ramda.not)(running), inBoard(size)(row, col));

    if (canToggle) {
      var value = (0, _ramda.equals)(1, byIndex(col, byIndex(row, board))) ? 0 : 1;
      board = updateCell(board, row, col, value);
    }

    onTick(board);

    return board;
  }

  function createCell() {
    return generate ? (0, _randomInt2.default)(0, 1) : 0;
  }

  function updateCell(board, row, col, value) {
    var newRow = (0, _ramda.compose)((0, _ramda.update)(col, value), byIndex(row))(board);

    return (0, _ramda.update)(row, newRow, board);
  }

  function inBoard(size) {
    return function (row, col) {
      return (0, _ramda.and)((0, _ramda.and)((0, _ramda.gt)(row, -1), (0, _ramda.gt)(col, -1)), (0, _ramda.and)((0, _ramda.lt)(row, size), (0, _ramda.lt)(col, size)));
    };
  }

  function getValue(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        row = _ref3[0],
        col = _ref3[1];

    return inBoard(size)(row, col) ? byIndex(col, byIndex(row, board)) : 0;
  }

  function active() {
    return (0, _ramda.gt)(reduce(function (acc, v) {
      return acc + (0, _ramda.sum)(v);
    }, 0, board), 0);
  }

  function neighbors(row, col) {
    return (0, _ramda.sum)((0, _ramda.map)(getValue, [[(0, _ramda.subtract)(row, 1), (0, _ramda.subtract)(col, 1)], [(0, _ramda.subtract)(row, 1), col], [(0, _ramda.subtract)(row, 1), (0, _ramda.add)(col, 1)], [row, (0, _ramda.subtract)(col, 1)], [row, (0, _ramda.add)(col, 1)], [(0, _ramda.add)(row, 1), (0, _ramda.subtract)(col, 1)], [(0, _ramda.add)(row, 1), col], [(0, _ramda.add)(row, 1), (0, _ramda.add)(col, 1)]]));
  }
};

exports.default = sim;
