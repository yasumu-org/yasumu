#!/usr/bin/env node

import { createCLI } from 'yasumu';

await createCLI({
  args: process.argv.slice(2),
});
