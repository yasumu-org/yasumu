import { Hono } from 'jsr:@hono/hono@4.6.9';
const app = new Hono();

app.get('/', (c) => c.text('Hono!'));

Deno.serve(app.fetch);
