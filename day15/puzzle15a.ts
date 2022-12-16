import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'beacons.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

// What about creating min/max ranges in each row where it can't be?

// Create a map of row to an array of min/max pairs

// Take the input row
//// For each place, check if it's in range of any of the beacons. If it is, then it counts.

const ROW_NUMBER = 10;

interface sensor {
  x: number;
  y: number;
  manhattanRadius: number;
}

const sensors: sensor[] = []

const getManhattanDistance = (sensorX: number, sensorY: number, beaconX: number, beaconY: number) => {
   return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY)
}

const hasBeacon = (x: number, y: number): boolean => {
  for (let s of sensors) {
    if (s.x === x && s.y === y) return true
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
});

file.on('close', () => {
  sensors.forEach((s) => console.log(JSON.stringify(s, undefined, 2)))

  let noBeaconPositions = 0

  for (let i = -100; i < 100; i++) {
    for (let s of sensors) {
      if (getManhattanDistance(s.x, s.y, i, ROW_NUMBER) <= s.manhattanRadius || hasBeacon(ROW_NUMBER, i)) {
        console.log(hasBeacon(ROW_NUMBER, i))
        console.log(`x: ${i}`)
        noBeaconPositions++
        break;
      }
    }
  }

  console.log(sensors)

  console.log(`There are ${noBeaconPositions} positions on this row that cannot contain a beacon`)
});
