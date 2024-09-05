export const YasumuEvents = {
  // smtp
  NewEmail: 'new-email',
  RefreshAll: 'refresh-all',
} as const;

export type YasumuEvents = (typeof YasumuEvents)[keyof typeof YasumuEvents];
