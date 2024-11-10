const [command, ...args] = Deno.args;

switch (command) {
  case 'ping':
    console.log(`Pong! You sent ${args.join(' ')}`);
    break;
  default:
    console.log('Please provide a valid command');
    Deno.exit(1);
}
