import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'hill-climbing.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

let mapRows: number[][] = [];
let start: [number, number, number] = [-1, -1, 0];
let end: [number, number] = [-1, -1];
let shortestPath = Infinity;
let startingPoints: [number, number, number][] = [];

const bfs = (start: [number, number, number]) => {
  let queue: [number, number, number][] = [start];
  let seen = new Set<string>();
  seen.add(`0 0`);

  while (queue.length > 0) {
    queue.sort((a, b) => b[2] - a[2]);
    let location = queue.pop();
    if (!location) throw new Error('No location found!');
    const currentLocationString = `${location[0]} ${location[1]}`;
    const endString = `${end[0]} ${end[1]}`;

    if (currentLocationString === endString) {
      console.log(
        `Found the end at ${currentLocationString} with ${location[2]} steps.`
      );
      shortestPath = Math.min(shortestPath, location[2]);
      seen.delete(endString)
      continue;
    }

    let currentElevation = mapRows[location[0]][location[1]];
    let westElevation =
      location[1] > 0 ? mapRows[location[0]][location[1] - 1] : Infinity;
    let eastElevation =
      location[1] < mapRows[0].length - 1
        ? mapRows[location[0]][location[1] + 1]
        : Infinity;
    let northElevation =
      location[0] > 0 ? mapRows[location[0] - 1][location[1]] : Infinity;
    let southElevation =
      location[0] < mapRows.length - 1
        ? mapRows[location[0] + 1][location[1]]
        : Infinity;

    const westLocationString = `${location[0]} ${location[1] - 1}`;
    const eastLocationString = `${location[0]} ${location[1] + 1}`;
    const northLocationString = `${location[0] - 1} ${location[1]}`;
    const southLocationString = `${location[0] + 1} ${location[1]}`;

    // Check West
    if (
      currentElevation >= westElevation - 1 &&
      westElevation !== Infinity &&
      !seen.has(`${westLocationString}`)
    ) {
      seen.add(`${westLocationString}`);
      queue.push([location[0], location[1] - 1, location[2] + 1]);
    }

    // Check East
    if (
      currentElevation >= eastElevation - 1 &&
      eastElevation !== Infinity &&
      !seen.has(`${eastLocationString}`)
    ) {
      seen.add(`${eastLocationString}`);
      queue.push([location[0], location[1] + 1, location[2] + 1]);
    }

    // Check North
    if (
      currentElevation >= northElevation - 1 &&
      northElevation !== Infinity &&
      !seen.has(`${northLocationString}`)
    ) {
      seen.add(`${northLocationString}`);
      queue.push([location[0] - 1, location[1], location[2] + 1]);
    }

    // Check South
    if (
      currentElevation >= southElevation - 1 &&
      southElevation !== Infinity &&
      !seen.has(`${southLocationString}`)
    ) {
      seen.add(`${southLocationString}`);
      queue.push([location[0] + 1, location[1], location[2] + 1]);
    }
  }
};

file.on('line', (line) => {
  let row: number[] = [];
  for (let c of line) {
    if (c === 'S') {
      start[0] = mapRows.length;
      start[1] = row.length;
      row.push('a'.charCodeAt(0));
    } else if (c === 'E') {
      end[0] = mapRows.length;
      end[1] = row.length;
      row.push('z'.charCodeAt(0));
    } else if (c === 'a') {
      let r = row.length;
      let s = mapRows.length;
      let loc: [number, number, number] = [s, r, 0];
      startingPoints.push(loc);
      row.push(c.charCodeAt(0));
    } else {
      row.push(c.charCodeAt(0));
    }
  }
  mapRows.push(row);
});

file.on('close', () => {
  for (let location of startingPoints) {
    bfs(location)
  }
  console.log(`The shortest path is ${shortestPath} steps`);
});
