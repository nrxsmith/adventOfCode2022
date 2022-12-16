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

const getSensorRangesForRow = (row: number) => {
  let ranges: [number, number][] = []

  sensors.forEach((sensor) => {
    const distanceToRow = Math.abs(sensor.y - row)
    if (distanceToRow > sensor.manhattanRadius) return

    const rangeRemaining = sensor.manhattanRadius - distanceToRow
    ranges.push([sensor.x - rangeRemaining, sensor.x + rangeRemaining])
  })

  return ranges
}

const checkRangesForRow = (row: number) => {
  let ranges = getSensorRangesForRow(row)

  if (ranges.length === 0) throw new Error('No ranges found')
  let mergedRange: [number, number] = ranges.pop()!

  let gapFound = false

  while (ranges.length > 0) {
    const r = ranges.find((range) => mergedRange[1] >= range[0] || range[1] >= mergedRange[0])
    
    if (!r) {
      gapFound = true
      console.log(`There is a gap on row ${row}`)
      console.log(`Ranges remaining:`)
      ranges.forEach((range) => {
        console.log(`${range[0]}-${range[1]}`)
      })
      break
    }

    ranges = ranges.filter((range) => !(mergedRange[1] >= range[0] || range[1] >= mergedRange[0]))
    if (mergedRange[1] >= r[0]!) mergedRange[1] = r[1]
    else if (r[1] >= mergedRange[0]) mergedRange[0] = r[0]
  }

  return gapFound
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
    let hasGap = checkRangesForRow(r)

    if (hasGap) {
      console.log(`Found a gap on row ${r}!`)
      break
    }
  }
  console.log('No gaps found')
});
