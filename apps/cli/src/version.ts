interface Metadata {
  version: string;
  name: string;
}

function $metadata(): Metadata {
  'use macro';

  const { version, name } = require('../package.json');
  return { version, name };
}

const metadata = $metadata();

export const version = metadata.version;

export const name = metadata.name;
