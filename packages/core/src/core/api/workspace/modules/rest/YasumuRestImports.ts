import { parseCurl } from '@/utils/curlParser.js';
import type { YasumuRest } from './YasumuRest.js';
import type { YasumuRestEntity } from './YasumuRestEntity.js';
import type { HttpMethods } from '@/core/common/constants.js';

export interface YasumuRestImportSource {
  source: string;
  name: string;
  method?: HttpMethods;
  path?: string;
}

export class YasumuRestImports {
  /**
   * Creates a new instance of YasumuRestImports.
   * @param rest The rest instance.
   */
  public constructor(public readonly rest: YasumuRest) {}

  /**
   * Import curl command as YasumuRestEntity.
   * @param source The source to import.
   */
  public async curl(source: YasumuRestImportSource): Promise<YasumuRestEntity> {
    const data = parseCurl(source.source);
    const method = (
      'method' in data ? String(data.method).toUpperCase() : 'GET'
    ) as HttpMethods;

    const entity = await this.rest.create(source.name, method, source.path);

    if (data.url) entity.setUrl(data.url);

    if (data.headers.length) {
      entity.setHeaders(data.headers);
    }

    if (data.body) {
      entity.setBody({
        text: data.body.text,
        json: data.body.json,
      });
    }

    await entity.save();

    return entity;
  }
}
