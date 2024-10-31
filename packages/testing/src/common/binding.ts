import type { CommandInterceptor } from '@/interceptors/commands.js';

export const COMMAND_BINDINGS = new Map<string, CommandInterceptor>();
