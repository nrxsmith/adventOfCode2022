import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'cave-sand.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

const emptyStartingRow: boolean[] = new Array(1000);
emptyStartingRow.fill(false, 0);
const cave: boolean[][] = new Array(200);
for (let i = 0; i < cave.length; i++) {
  cave[i] = Array.from(emptyStartingRow);
}

interface point {
  x: number;
  y: number;
}

const insertRockVein = (coordinate1: point, coordinate2: point) => {
  // go down if positive, up if negative
  if (coordinate1.x === coordinate2.x) {
    let x = coordinate1.x;
    let y = coordinate1.y;

    if (coordinate2.y - coordinate1.y > 0) {
      while (y <= coordinate2.y) {
        cave[y][x] = true;
        y++;
      }
    } else if (coordinate2.y - coordinate1.y < 0) {
      while (y >= coordinate2.y) {
        cave[y][x] = true;
        y--;
      }
    }
  } else if (coordinate1.y === coordinate2.y) {
    let x = coordinate1.x;
    let y = coordinate1.y;

    if (coordinate2.x - coordinate1.x > 0) {
      while (x <= coordinate2.x) {
        cave[y][x] = true;
        x++;
      }
    } else if (coordinate2.x - coordinate1.x < 0) {
      while (x >= coordinate2.x) {
        cave[y][x] = true;
        x--;
      }
    }
  } else throw new Error('Malformed coordinate set');
};

const dropSand = () => {
  let falling = true;
  let fallingForever = false;

  let position: point = {
    x: 500,
    y: -1,
  };

  // Add a row if there aren't enough
  while (falling && !fallingForever) {
 
    if (!cave[position.y + 1]) {
      cave[position.y + 1] = Array.from(emptyStartingRow);
    }

    const downBlocked = cave[position.y + 1][position.x];
    const downLeftBlocked = cave[position.y + 1][position.x - 1];
    const downRightBlocked = cave[position.y + 1][position.x + 1];

    if (!downBlocked) {
      position.y += 1;
    } else if (!downLeftBlocked) {
      position.y += 1;
      position.x -= 1;
    } else if (!downRightBlocked) {
      position.y += 1;
      position.x += 1;
    } else {
      cave[position.y][position.x] = true;
      falling = false;
      return fallingForever;
    }
    if (position.y > 1000) {
      console.log('We seem to be falling forever.');
      fallingForever = true;
      return fallingForever;
    }
  }
  return fallingForever;
};

const parseLine = (line: string): point[] => {
  let lineCoordinates: point[] = [];
  const coordinateMatches = line.matchAll(/\d+,\d+/g);
  for (const m of coordinateMatches) {
    let s = m[0].split(',');
    let c: point = {
      x: Number.parseInt(s[0]),
      y: Number.parseInt(s[1]),
    };
    lineCoordinates.push(c);
  }
  return lineCoordinates;
};

file.on('line', (line) => {
  let coordinates = parseLine(line);
  for (let i = 0; i < coordinates.length - 1; i++) {
    insertRockVein(coordinates[i], coordinates[i + 1]);
  }
});

file.on('close', () => {
  for (let r = 0; r < 200; r++) {
    let row = '';
    for (let c = 480; c < 520; c++) {
      if (cave[r][c] === true) {
        row = `${row}#`;
      } else {
        row = `${row}.`;
      }
    }
    console.log(row);
  }

  let sandCount = 0;
  let done = false;

  while (!done && sandCount < 1000) {
    sandCount++;
    done = dropSand();
  }

  console.log(
    `We dropped ${sandCount - 1} grains of sand before falling forever.`
  );

});
