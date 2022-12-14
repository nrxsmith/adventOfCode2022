import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'beacons.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const ROW_NUMBER = 10;

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
  sensors.forEach((s) => console.log(JSON.stringify(s, undefined, 2)))
  console.log('------BEACONS-------')
  beacons.forEach((s) => console.log(JSON.stringify(s, undefined, 2)))
  let noBeaconPositions = 0

  for (let i = -10000000; i < 10000000; i++) {
    for (let s of sensors) {
      if (getManhattanDistance(s.x, s.y, i, ROW_NUMBER) <= s.manhattanRadius && !hasItem(i, ROW_NUMBER, beacons)) {
        if (hasItem(i, ROW_NUMBER, beacons)) console.log(`x: ${i} y: ${ROW_NUMBER}`)
        noBeaconPositions++
        break;
      }
    }
  }

  console.log(`There are ${noBeaconPositions} positions on this row that cannot contain a beacon`)
});
