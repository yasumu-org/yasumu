import { Yasumu, CommandInterceptor } from '@yasumu/testing';

new CommandInterceptor('ping').intercept(() => {
  return 'Pong!';
});

await Yasumu.command.invoke('ping').then((result) => {
  console.log(result); // Pong!
});
