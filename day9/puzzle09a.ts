import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'rope-moves.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});


let headPosition = { x: 0, y: 0 };
let tailPosition = { x: 0, y: 0 };
let locationsVisited = new Set();
let tailLocationString = `${tailPosition.x},${tailPosition.y}`
locationsVisited.add(tailLocationString)

const areTouching = () => {
  let xDistance = Math.abs(headPosition.x - tailPosition.x);
  let yDistance = Math.abs(headPosition.y - tailPosition.y);

  if (xDistance > 1 || yDistance > 1) return false;

  return true;
};

const isDiagonalFromHead = () => {
  let xDistance = Math.abs(headPosition.x - tailPosition.x);
  let yDistance = Math.abs(headPosition.y - tailPosition.y);

  if (xDistance > 0 && yDistance > 0) return true;

  return false;
};

const followDiagonal = () => {
  let direction = '';

  if (
    headPosition.x - tailPosition.x > 0 &&
    headPosition.y - tailPosition.y > 0
  ) {
    direction = 'upRight';
  } else if (
    headPosition.x - tailPosition.x < 0 &&
    headPosition.y - tailPosition.y > 0
  ) {
    direction = 'upLeft';
  } else if (
    headPosition.x - tailPosition.x > 0 &&
    headPosition.y - tailPosition.y < 0
  ) {
    direction = 'downRight';
  } else if (
    headPosition.x - tailPosition.x < 0 &&
    headPosition.y - tailPosition.y < 0
  ) {
    direction = 'downLeft';
  }

  switch (direction) {
    case 'upRight':
      tailPosition.x = tailPosition.x + 1;
      tailPosition.y = tailPosition.y + 1;
      break;
    case 'upLeft':
      tailPosition.x = tailPosition.x - 1;
      tailPosition.y = tailPosition.y + 1;
      break;
    case 'downRight':
      tailPosition.x = tailPosition.x + 1;
      tailPosition.y = tailPosition.y - 1;
      break;
    case 'downLeft':
      tailPosition.x = tailPosition.x - 1;
      tailPosition.y = tailPosition.y - 1;
      break;
    default:
      throw new Error('Unknown diagonal direction');
  }
};

const followStraight = () => {
  if (headPosition.x > tailPosition.x) {
    tailPosition.x++;
    return
  } else if (headPosition.x < tailPosition.x) {
    tailPosition.x--;
    return
  } else if (headPosition.y > tailPosition.y) {
    tailPosition.y++;
    return
  } else if (headPosition.y < tailPosition.y) {
    tailPosition.y--;
    return
  }
  throw new Error(
    'No straight path to follow; head seems to be diagonal from tail'
  );
};

const moveHead = (line: string) => {
  let direction = line[0];
  let distance = Number.parseInt(line.slice(2));

  switch (direction) {
    case 'R':
      headPosition = { x: headPosition.x + distance, y: headPosition.y };
      break;
    case 'L':
      headPosition = { x: headPosition.x - distance, y: headPosition.y };
      break;
    case 'U':
      headPosition = { x: headPosition.x, y: headPosition.y + distance };
      break;
    case 'D':
      headPosition = { x: headPosition.x, y: headPosition.y - distance };
      break;
    default:
      throw new Error('Unknown direction');
  }
};

const moveTail = () => {
  while (!areTouching()) {
    if (isDiagonalFromHead()) {
      followDiagonal();
    } else {
      followStraight()
    }
    tailLocationString = `${tailPosition.x},${tailPosition.y}`
    locationsVisited.add(tailLocationString)
  }
  return;
};

file.on('line', (line) => {
  moveHead(line);
  moveTail();
});

file.on('close', () => {
  console.log(`The tail has visited ${locationsVisited.size} locations`);
});
