export interface ProcessCommon {
  exit(code?: number): Promise<void>;
  relaunch(): Promise<void>;
}
