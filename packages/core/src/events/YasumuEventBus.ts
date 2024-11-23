import mittLib, { type EventType } from 'mitt';
import type { YasumuWorkspaceEventsMap } from './common.js';

const mitt = mittLib.default || mittLib;

export const createYasumuEventBus = () => {
  return mitt<{
    [K in keyof YasumuWorkspaceEventsMap]: YasumuWorkspaceEventsMap[K];
  }>();
};
