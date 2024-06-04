import { YasumuEnvironment } from './environment';
import { YasumuInterceptorManager } from './interceptors';
import { YasumuVariables } from './variables';

import { YasumuRequest } from './request';
import type { YasumuResponse } from './response';
import { YasumuRequestAuthorization } from './authorization';

export interface YasumuRequestData {}

export class Yasumu {
  public readonly authorization = new YasumuRequestAuthorization();
  public readonly environments = new YasumuEnvironment();
  public readonly variables = new YasumuVariables();
  public readonly interceptors = {
    request: new YasumuInterceptorManager<YasumuRequest>(),
    response: new YasumuInterceptorManager<YasumuResponse>(),
  };
  public requests = new Map<string, YasumuRequest>();

  public constructor(data: YasumuRequestData) {}

  public createRequest() {
    const req = new YasumuRequest(this);

    this.requests.set(req.id, req);

    return req;
  }

  public serialize(): YasumuRequestData {
    return {};
  }
}
