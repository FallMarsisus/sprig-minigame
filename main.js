/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: toto
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const brick = "b"
const platform = "l"
const box = "a"

setLegend(
  [player, bitmap`
................
................
.......000......
.......060......
......0660......
......06660.0...
....0003630.0...
....0.0666000...
....0.05550.....
......06660.....
.....066660.....
.....06660......
......000.......
......0.0.......
.....00.00......
................`],
  [brick, bitmap`
0000000000000000
0CCC0CCC0CCC0CCC
0CCC0CCC0CCC0CCC
0000000000000000
CCC0CCC0CCC0CCC0
CCC0CCC0CCC0CCC0
0000000000000000
CC0CCC0CCC0CCC0C
CC0CCC0CCC0CCC0C
0000000000000000
C0CCC0CCC0CCC0CC
C0CCC0CCC0CCC0CC
0000000000000000
0CCC0CCC0CCC0CCC
0CCC0CCC0CCC0CCC
0000000000000000`],
  [platform, bitmap`
0000000000000000
0666666666666660
0666666666666660
.06666666666660.
..000000000000..
................
................
................
................
................
................
................
................
................
................
................`],
  [box, bitmap`
0000000000000000
000CCCCCCCCCC000
00CCCCCCCCCCCC00
0CC0000000000CC0
0CC0CCCCCC000CC0
0CC0CCCCC0000CC0
0CC0CCCC000C0CC0
0CC0CCC000CC0CC0
0CC0CC000CCC0CC0
0CC0C000CCCC0CC0
0CC0000CCCCC0CC0
0CC000CCCCCC0CC0
0CC0000000000CC0
00CCCCCCCCCCCC00
000CCCCCCCCCC000
0000000000000000`]
)

setSolids([player, brick, platform, box])

let level = 0
const levels = [
  map`
..........
..........
..........
........ll
..........
....ll....
.p.....a..
bbbbbbbbbb`
]

setMap(levels[level])

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


async function jump() {
  getFirst(player).y -= 1
  await wait(500);
  getFirst(player).x += 1
  await wait(500);
}

setPushables({
  [player]: [box]
})

onInput("d", () => {
  getFirst(player).x += 1
})
onInput("a", () => {
  getFirst(player).x -= 1
})
onInput("l", () => {
  jump()
})





afterInput(() => {
  var tile_under_player = getTile(getFirst(player).x, getFirst(player).y + 1)
  if (tile_under_player.length == 0) {
    getFirst(player).y += 1
  }
})
