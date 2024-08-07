/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: toto
@author: marsisus
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const brick = "b"
const platform = "l"
const box = "a"
const cloud_r = "c"
const background = "f"
const cloud_l = "d"
let is_jumping = false

setLegend(
  [player, bitmap`
................
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
.....00.00......`],
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
0000000000000000`],
  [cloud_r, bitmap`
................
................
................
................
................
................
..0000..........
.022220.........
.0222220........
022222220.000...
22222222202220..
222222220222220.
2222222222222220
2222222222222220
2222222222222220
0000000000000000`],
  [cloud_l, bitmap`
................
................
................
................
................
................
................
................
..........000...
.........02220.0
........02222202
........02222222
........02222222
........02222222
........02222222
.........0000000`],
  [background, bitmap`
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777`]
)

setSolids([player, brick, platform, box])

let level = 0
const levels = [
  map`
..........
...dc.....
dc......ll
.......l..
.....l....
....l.....
.p.....a..
bbbbbbbbbb`,
  map`
..........
..a....dc.
llll......
.....l....
..........
..........
p.....a...
bbb.bbb..b`,
  map`
..........
.dc.......
........ll
..........
.....b..dc
....bb....
p..bbb....
bbbbbb.l.l`,
]

setBackground(background)

setMap(levels[level])

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


async function gravity() {
  if (!is_jumping) {
    for (let i = 0; i < 5; i++) {
      var tile_under_player = getTile(getFirst(player).x, getFirst(player).y + 1)
      if (tile_under_player.length == 0) {
        await wait(50)
        getFirst(player).y += 1
        if (getFirst(player).y == 7) {
          level = 0
          for(let i =0; i<width(); i++) {
            clearTile(i, 1)
            clearTile(i, 2)
            clearTile(i, 3)
          }
          clearTile(getFirst(player).x, getFirst(player).y)

          addText("Game Over", { 
            x: 6,
            y: 4,
            color: color`3`
          })
          await wait(3000)
          clearText()
          setMap(levels[level])
        }
      }
    }
  }
}

async function jump() {
  if (!is_jumping) {

    is_jumping = true
    getFirst(player).y -= 1
    await wait(50)
    getFirst(player).y -= 1
    await wait(200)
    is_jumping = false
    gravity()
  }
}

async function blockfall() {
  var boxes = getAll(box)
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < 6; j++) {
      var tile_under_box = getTile(boxes[i].x, boxes[i].y + 1)
      if (tile_under_box.length == 0) {
        boxes[i].y += 1
        await wait(50)
      }
    }
  }

}

async function playerfall() {
  gravity()
}


setPushables({
  [player]: [box]
})

onInput("d", () => {
  if (getFirst(player).x == 9) {
    var old_y = getFirst(player).y;
    level++;
    setMap(levels[level])
    getFirst(player).x = 0
    getFirst(player).y = old_y
  } else {
    getFirst(player).x += 1
  }

})
onInput("a", () => {
  getFirst(player).x -= 1
})
onInput("l", () => {
  jump()
})



afterInput(() => {

  playerfall()
  blockfall()
})
