import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'beacons.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

interface position {
  x: number;
  y: number;
}

interface sensor extends position {
  manhattanRadius: number;
}

const sensors: sensor[] = []
const beacons: position[] = []

const getManhattanDistance = (sensorX: number, sensorY: number, beaconX: number, beaconY: number) => {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY)
}

const hasItem = (x: number, y: number, items: position[]): boolean => {
  for (let i of items) {
    if (i.x === x && i.y === y) return true
  }
  return false
}

file.on('line', (line) => {
  const matches = line.matchAll(/-?\d+/g);
  const coordinates: number[] = []

  for (const match of matches) {
    coordinates.push(Number.parseInt(match[0]))
  }

  sensors.push({
    x: coordinates[0],
    y: coordinates[1],
    manhattanRadius: getManhattanDistance(coordinates[0], coordinates[1], coordinates[2], coordinates[3])
  })

  beacons.push({
    x: coordinates[2],
    y: coordinates[3]
  })
});

file.on('close', () => {
  for (let r = 0; r < 4000000; r++) {
  console.log(`Row ${r}`)
    for (let i = 0; i < 4000000; i++) {
      let couldBeHere = true
      for (let s of sensors) {
        if (getManhattanDistance(s.x, s.y, i, r) <= s.manhattanRadius || hasItem(i, r, sensors) || hasItem(i, r, beacons)) {
          couldBeHere = false
          break;
        }
      }
      if (couldBeHere) {
        console.log(`It could be here! x: ${i} y:${r}`)
        console.log(`Tuning frequency is ${(4000000 * i) + r}`)
      }
    }
  }
});
