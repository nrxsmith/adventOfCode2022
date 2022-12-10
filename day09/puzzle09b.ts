import fs from 'fs';
import readline from 'readline';
import path from 'path';

const elfFile = path.join(__dirname, 'rope-moves.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

interface position {
  x: number;
  y: number;
}

let positions: position[] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

let locationsVisited = new Set();
let tailLocationString = `${positions[9].x},${positions[9].y}`;
locationsVisited.add(tailLocationString);

const areTouching = (leaderIndex: number, followerIndex: number) => {
  let xDistance = Math.abs(
    positions[leaderIndex].x - positions[followerIndex].x
  );
  let yDistance = Math.abs(
    positions[leaderIndex].y - positions[followerIndex].y
  );

  if (xDistance > 1 || yDistance > 1) return false;

  return true;
};

const isDiagonalFromLeader = (followerIndex: number) => {
  let xDistance = Math.abs(
    positions[followerIndex - 1].x - positions[followerIndex].x
  );
  let yDistance = Math.abs(
    positions[followerIndex - 1].y - positions[followerIndex].y
  );

  if (xDistance > 0 && yDistance > 0) return true;

  return false;
};

const followDiagonal = (followerIndex: number) => {
  let direction = '';

  if (
    positions[followerIndex - 1].x - positions[followerIndex].x > 0 &&
    positions[followerIndex - 1].y - positions[followerIndex].y > 0
  ) {
    direction = 'upRight';
  } else if (
    positions[followerIndex - 1].x - positions[followerIndex].x < 0 &&
    positions[followerIndex - 1].y - positions[followerIndex].y > 0
  ) {
    direction = 'upLeft';
  } else if (
    positions[followerIndex - 1].x - positions[followerIndex].x > 0 &&
    positions[followerIndex - 1].y - positions[followerIndex].y < 0
  ) {
    direction = 'downRight';
  } else if (
    positions[followerIndex - 1].x - positions[followerIndex].x < 0 &&
    positions[followerIndex - 1].y - positions[followerIndex].y < 0
  ) {
    direction = 'downLeft';
  }

  switch (direction) {
    case 'upRight':
      positions[followerIndex].x = positions[followerIndex].x + 1;
      positions[followerIndex].y = positions[followerIndex].y + 1;
      break;
    case 'upLeft':
      positions[followerIndex].x = positions[followerIndex].x - 1;
      positions[followerIndex].y = positions[followerIndex].y + 1;
      break;
    case 'downRight':
      positions[followerIndex].x = positions[followerIndex].x + 1;
      positions[followerIndex].y = positions[followerIndex].y - 1;
      break;
    case 'downLeft':
      positions[followerIndex].x = positions[followerIndex].x - 1;
      positions[followerIndex].y = positions[followerIndex].y - 1;
      break;
    default:
      throw new Error('Unknown diagonal direction');
  }
};

const followStraight = (followerIndex: number) => {
  if (positions[followerIndex - 1].x > positions[followerIndex].x) {
    positions[followerIndex].x++;
    return;
  } else if (positions[followerIndex - 1].x < positions[followerIndex].x) {
    positions[followerIndex].x--;
    return;
  } else if (positions[followerIndex - 1].y > positions[followerIndex].y) {
    positions[followerIndex].y++;
    return;
  } else if (positions[followerIndex - 1].y < positions[followerIndex].y) {
    positions[followerIndex].y--;
    return;
  }
  throw new Error(
    'No straight path to follow; head seems to be diagonal from tail'
  );
};

const getDirection = (line: string) => {
  return line[0];
};

const getDistance = (line: string) => {
  return Number.parseInt(line.slice(2));
};

const moveHeadOne = (direction: string) => {
  switch (direction) {
    case 'R':
      positions[0] = { x: positions[0].x + 1, y: positions[0].y };
      break;
    case 'L':
      positions[0] = { x: positions[0].x - 1, y: positions[0].y };
      break;
    case 'U':
      positions[0] = { x: positions[0].x, y: positions[0].y + 1 };
      break;
    case 'D':
      positions[0] = { x: positions[0].x, y: positions[0].y - 1 };
      break;
    default:
      throw new Error('Unknown direction');
  }
};

const moveFollowerOne = (index: number) => {
  if (!areTouching(index, index - 1)) {
    if (isDiagonalFromLeader(index)) {
      followDiagonal(index);
    } else {
      followStraight(index);
    }
  }
  return;
};

file.on('line', (line) => {
  let direction = getDirection(line);
  let distance = getDistance(line);

  for (let i = 0; i < distance; i++) {
    moveHeadOne(direction);
    for (let j = 1; j < positions.length; j++) {
      moveFollowerOne(j);
    }
    tailLocationString = `${positions[9].x},${positions[9].y}`;
    locationsVisited.add(tailLocationString);
  }
});

file.on('close', () => {
  console.log(`The tail has visited ${locationsVisited.size} locations`);
});
