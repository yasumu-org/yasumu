import { execSync } from 'child_process';
import { copyFile } from 'node:fs/promises';

const ext = process.platform === 'win32' ? '.exe' : '';
const rustInfo = execSync('rustc -vV');
const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];

if (!targetTriple) {
  console.error('Failed to get target triple');
}

const targetDir = `./src-tauri/binaries/tanxium-${targetTriple}${ext}`;

try {
  await copyFile(`../../packages/tanxium/dist/tanxium${ext}`, targetDir);
  console.log('Copied tanxium binary successfully!');
} catch (e) {
  console.error('Failed to copy tanxium binary');
  console.error(e);
}
