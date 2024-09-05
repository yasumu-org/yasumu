export interface ApplicationCommon {
  getName(): Promise<string>;
  getVersion(): Promise<string>;
  getRuntimeVersion(): Promise<string>;
}
