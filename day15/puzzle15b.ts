import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'beacons.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const AREA_LIMIT = 4000000;

interface position {
  x: number;
  y: number;
}

interface sensor extends position {
  manhattanRadius: number;
}

const sensors: sensor[] = [];
const beacons: position[] = [];

const getManhattanDistance = (
  sensorX: number,
  sensorY: number,
  beaconX: number,
  beaconY: number
) => {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
};

const getSensorRangesForRow = (row: number) => {
  let ranges: [number, number][] = [];

  sensors.forEach((sensor) => {
    const distanceToRow = Math.abs(sensor.y - row);
    if (distanceToRow > sensor.manhattanRadius) return;

    const rangeRemaining = sensor.manhattanRadius - distanceToRow;
    const min = Math.max(0, sensor.x - rangeRemaining);
    const max = Math.min(AREA_LIMIT, sensor.x + rangeRemaining);
    ranges.push([min, max]);
  });

  return ranges;
};

const checkRangesForRow = (row: number) => {
  let ranges = getSensorRangesForRow(row);
  if (ranges.length === 0) throw new Error('No ranges found');
  let mergedRange: [number, number] = ranges.pop()!;

  let gapFound = false;

  while (ranges.length > 0) {
    // Find the index of the first overlapping range
    const r = ranges.findIndex(
      (range) =>
        (mergedRange[1] >= range[0] && mergedRange[1] <= range[1]) ||
        (mergedRange[0] <= range[1] && mergedRange[0] >= range[0])
    );

    // If there isn't one, we found a gap
    if (r === -1) {
      gapFound = true;

      for (let i = 0; i < AREA_LIMIT; i++) {
        let inRanges = false
        getSensorRangesForRow(row).forEach((rg) => {
          if ( i >= rg[0] && i <= rg[1]) {
            inRanges = true
          }
        })
        if (!inRanges) {
          console.log(`Gap found at x: ${row} y: ${i}`)
          console.log(`Tuning frequency is ${(i * AREA_LIMIT) + row}`)
        }

      }
      break;
    }

    // Extend the merged range to cover the one we found
    if (mergedRange[1] >= ranges[r][0] && mergedRange[1] <= ranges[r][1]) {
      mergedRange[1] = ranges[r][1];
    } 
    
    if (mergedRange[0] >= ranges[r][0] && mergedRange[0] <= ranges[r][1]) {
      mergedRange[0] = ranges[r][0];
    }

    // Remove the range we found
    ranges = ranges.filter((range, index) => {
      if (index !== r) {
        return range;
      }
    });

    // Remove any ranges completely covered by the existing merged range
    ranges = ranges.filter(
      (range) => !(mergedRange[0] <= range[0] && mergedRange[1] >= range[1])
    );
  }
  return gapFound;
};

file.on('line', (line) => {
  const matches = line.matchAll(/-?\d+/g);
  const coordinates: number[] = [];

  for (const match of matches) {
    coordinates.push(Number.parseInt(match[0]));
  }

  sensors.push({
    x: coordinates[0],
    y: coordinates[1],
    manhattanRadius: getManhattanDistance(
      coordinates[0],
      coordinates[1],
      coordinates[2],
      coordinates[3]
    ),
  });

  beacons.push({
    x: coordinates[2],
    y: coordinates[3],
  });
});

file.on('close', () => {
  let hasGap = false
  for (let r = 0; r < AREA_LIMIT; r++) {
    hasGap = checkRangesForRow(r);

    if (hasGap) {
      break;
    }
  }
  if (!hasGap) console.log('No gaps found');
});
