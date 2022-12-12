import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'hill-climbing.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

let mapRows: number[][] = []
let start: [number, number] = [-1, -1]
let end: [number, number] = [-1, -1]
let shortestPath = Infinity

const searchForPath = (location: [number, number], visited: Set<string>, steps: number) => {
  const currentLocationString = `${location[0]} ${location[1]}`
  const endString = `${end[0]} ${end[1]}`
  console.log(`Searching from ${currentLocationString}`)
  console.log(`Current step count: ${steps}`)

  if (currentLocationString === endString) {
    console.log(`Found the end!`)
    shortestPath = Math.min(shortestPath, steps)
  }

  if (steps >= shortestPath) {
    return
  }

  let currentElevation = mapRows[location[0]][location[1]]
  let westElevation = location[1] > 0 ? mapRows[location[0]][location[1] - 1] : Infinity
  let eastElevation = location[1] < mapRows[0].length - 1? mapRows[location[0]][location[1] + 1] : Infinity
  let northElevation = location[0] > 0 ? mapRows[location[0] - 1][location[1]] : Infinity
  let southElevation = location[0] < mapRows.length - 1 ? mapRows[location[0] + 1][location[1]] : Infinity

  const westLocationString = `${location[0]} ${location[1] - 1}`
  const eastLocationString = `${location[0]} ${location[1] + 1}`
  const northLocationString = `${location[0] - 1} ${location[1]}`
  const southLocationString = `${location[0] + 1} ${location[1]}`

  visited.add(currentLocationString)

  if (!visited.has(westLocationString) && currentElevation <= westElevation + 1 && currentElevation >= westElevation - 1) {
    console.log('Going west')
    searchForPath([location[0], location[1] - 1], new Set(visited), steps + 1)
  }
  
  if (!visited.has(eastLocationString) && currentElevation <= eastElevation + 1 && currentElevation >= eastElevation - 1) {
    console.log('Going east')
    searchForPath([location[0], location[1] + 1], new Set(visited), steps + 1)
  } 
  
  if (!visited.has(northLocationString) && currentElevation <= northElevation + 1 && currentElevation >= northElevation - 1) {
    console.log('Going north')
    searchForPath([location[0] - 1, location[1]], new Set(visited), steps + 1)
  } 
  
  if (!visited.has(southLocationString) && currentElevation <= southElevation + 1 && currentElevation >= southElevation - 1) {
    console.log('Going south')
    searchForPath([location[0] + 1, location[1]], new Set(visited), steps + 1)
  }
  console.log(`No path found this way; stopping at ${currentLocationString}`)
}

file.on('line', (line) => {
  let row: number[] = []
  for (let c of line) {
    if (c === 'S') {
      start[0] = mapRows.length
      start[1] = row.length
      row.push('a'.charCodeAt(0))
    } else if (c === 'E') {
      end[0] = mapRows.length
      end[1] = row.length
      row.push('z'.charCodeAt(0))
    } else {
      row.push(c.charCodeAt(0))
    }
  }
  mapRows.push(row)
});

file.on('close', () => {
  console.log(mapRows)
  searchForPath(start, new Set(), 0)
  console.log(`The shortest path is ${shortestPath} steps`)
});
