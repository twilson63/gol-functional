# Functional Game of Life Engine

This is a functional game of life engine, using [ramda](http://ramdajs.com/)

[https://en.wikipedia.org/wiki/Conway's_Game_of_Life](https://en.wikipedia.org/wiki/Conway`s_Game_of_Life)

## Usage

```
const gol = require('gol-functional')

const sim = gol({
  size: 40,
  speed: 1000,
  generate: true
}, (board) => {
  console.log(board)
})

sim.start()

setTimeout(_ => sim.stop(), 30000)
```

## Parameters

gol(options, onTick)

options
  - size (size of board)
  - speed (speed of game tick)
  - generate ( auto generate board on create)

onTick
  - is a function that is called every game tick to update the ui, the board contains
    an array of rows, each row contains an array of cell, if the cell contains a zero it is considered dead, if the cell contains a 1 it is alive.

## Game Play

When you call gol a object is returned with the following methods:

- start (starts the simulation)
- stop (stops the simulation)
- tick (steps through the simulation once)
- toggle (allows you to toggle a cell on or off)

## Contributions



## License

MIT
