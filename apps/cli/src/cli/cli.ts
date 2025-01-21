import { Command } from 'commander';
import { version } from '../version.js';
import { bootstrap } from '../yasumu.js';

export interface YasumuCLIBootstrap {
  args: string[];
}

export async function createCLI(options: YasumuCLIBootstrap): Promise<void> {
  const program = new Command();
  const yasumu = bootstrap();

  program
    .name('Yasumu')
    .version(version)
    .description('A command line interface for Yasumu')
    .allowUnknownOption(false)
    .allowExcessArguments(false)
    .argument('[path]', 'Open an existing Yasumu workspace at the given path')
    .action(async (path: string) => {
      if (!path) return program.help({ error: true });
      const workspace = await yasumu.openWorkspace({ path, create: false });

      console.log('Opened workspace:', workspace.name);
    })
    .command('new <path>')
    .description('Create a new Yasumu project')
    .action(async (path) => {
      console.log('Creating new project at:', path);
      const workspace = await yasumu.openWorkspace({ path, create: true });

      console.log('Created workspace:', workspace.name);
    });

  await program.parseAsync(options.args, { from: 'user' });
}
