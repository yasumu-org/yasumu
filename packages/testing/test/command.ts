import { yasumu, CommandInterceptor } from '@yasumu/testing';

new CommandInterceptor('ping').intercept(() => {
  return 'Pong!';
});

await yasumu.command.invoke('ping').then((result) => {
  console.log(result); // Pong!
});
