import fs from 'fs';
import readline from 'readline';
import path from 'path';

const NEEDED_SPACE = 8381165;
let currentMinimum = Infinity;

const elfFile = path.join(__dirname, 'elfOS.txt');
const file = readline.createInterface({
  input: fs.createReadStream(elfFile),
  output: process.stdout,
  terminal: false,
});

type File = {
  name: string;
  size: number;
};

class FileSystemDir {
  name: string;
  parentNode: FileSystemDir | undefined;
  files: File[];
  directories: FileSystemDir[];

  constructor(
    name: string,
    parentNode: FileSystemDir | undefined,
    files: File[],
    directories: FileSystemDir[]
  ) {
    this.name = name;
    this.parentNode = parentNode;
    this.files = files;
    this.directories = directories;
  }

  getSize() {
    let dirSize = 0;

    this.files.forEach((file) => {
      dirSize += file.size;
    });

    this.directories.forEach((dir) => {
      dirSize += dir.getSize();
    });

    if (dirSize >= 8381165 && dirSize < currentMinimum) {
      currentMinimum = dirSize;
    }
    return dirSize;
  }
}

let rootDir = new FileSystemDir('/', undefined, [], []);
let currentDir = rootDir;

const parseLine = (line: string) => {
  let command = line;
  let newDirOrFileName = '';
  let size = 0;

  if (
    line.startsWith('$ cd') &&
    line.slice(0, 7) !== '$ cd ..' &&
    line.slice(0, 6) !== '$ cd /'
  ) {
    command = 'downNode';
    newDirOrFileName = line.slice(5);
  } else if (line.startsWith('dir')) {
    command = 'newDir';
    newDirOrFileName = line.slice(4);
  } else if (line.match(/^\d/)) {
    command = 'newFile';
    let split = line.split(' ');
    size = Number.parseInt(split[0]);
    newDirOrFileName = split[1];
  }

  switch (command) {
    case '$ cd /':
      currentDir = rootDir;
      break;
    case '$ cd ..':
      if (currentDir !== rootDir) {
        currentDir = currentDir.parentNode!;
      } else {
        currentDir = rootDir;
      }
      break;
    case '$ ls':
      // No action, following lines are read
      break;
    case 'downNode':
      let nextDir: FileSystemDir | undefined = undefined;
      nextDir = currentDir.directories.find((dir) => {
        return dir.name === newDirOrFileName;
      });
      if (nextDir === undefined) {
        throw new Error('No directory found by that name');
      }
      currentDir = nextDir;
      break;
    case 'newDir':
      currentDir.directories.push(
        new FileSystemDir(newDirOrFileName, currentDir, [], [])
      );
      break;
    case 'newFile':
      currentDir.files.push({ name: newDirOrFileName, size });
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

file.on('line', (line) => {
  parseLine(line);
});

file.on('close', () => {
  rootDir.getSize();
  console.log(`Smallest directory >= ${NEEDED_SPACE}: ${currentMinimum}`);
});
