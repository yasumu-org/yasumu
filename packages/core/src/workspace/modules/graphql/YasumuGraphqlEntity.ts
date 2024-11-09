import { generateId } from '@/common/utils.js';
import { BaseEntity } from '../common/BaseEntity.js';
import { type ExecutionOptions, type ExecutionResult } from '../common/types.js';
import type { GraphqlIndex, YasumuRawGraphqlEntity } from './types.js';
import { GraphqlHttpMethod } from '@yasumu/common';
import type { DeepPartial } from '../rest/YasumuRestEntity.js';
import type { YasumuGraphql } from './YasumuGraphql.js';
import { INTROSPECTION_QUERY, type IntrospectionQuery } from './constants.js';

export interface GraphqlQueryOptions {
  query: string;
  operationName?: string;
  variables?: Record<string, GraphqlQueryVariableType>;
}

export type GraphqlQueryVariableType = string | number | boolean | null;

export class YasumuGraphqlEntity extends BaseEntity<YasumuRawGraphqlEntity> {
  public data!: YasumuRawGraphqlEntity;
  public introspectionData: IntrospectionQuery | null = null;

  /**
   * Construct a new rest entity
   * @param module The rest module that manages this entity
   * @param data The data of this entity
   */
  public constructor(
    public readonly module: YasumuGraphql,
    data?: DeepPartial<YasumuRawGraphqlEntity>,
  ) {
    super();
    this.#reformat(data);
  }

  #reformat(data?: DeepPartial<YasumuRawGraphqlEntity>) {
    if (!data || typeof data !== 'object') {
      data = {
        blocks: {},
      } as YasumuRawGraphqlEntity;
    }

    data.annotation = this.module.type;
    data.blocks!.Metadata ??= {} as GraphqlIndex;
    data.blocks!.Metadata.createdAt ??= Date.now();
    data.blocks!.Metadata.id ??= generateId();
    data.blocks!.Metadata.method ??= GraphqlHttpMethod.Get;
    data.blocks!.Metadata.name ??= 'Untitled request';
    data.blocks!.Metadata.path ??= '/';
    data.blocks!.Request = {
      headers: data.blocks!.Request?.headers ?? [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
      ],
      variables: data.blocks!.Request?.variables ?? {},
      url: data.blocks!.Request?.url ?? '',
      body: data.blocks!.Request?.body ?? '',
    };
    data.blocks!.Response = {
      headers: data.blocks!.Response?.headers ?? [],
      body: data.blocks!.Response?.body ?? '',
      size: data.blocks!.Response?.size ?? null,
      time: data.blocks!.Response?.time ?? null,
    };
    data.blocks!.AfterResponse ??= '';
    data.blocks!.BeforeRequest ??= '';
    data.blocks!.Test ??= '';

    this.data = data as YasumuRawGraphqlEntity;
  }

  public get method() {
    return this.data.blocks.Metadata.method ?? GraphqlHttpMethod.Post;
  }

  public get url() {
    return this.data.blocks.Request.url;
  }

  public get headers() {
    return this.data.blocks.Request.headers ?? [];
  }

  public setURL(url: string) {
    this.data.blocks.Request.url = url;
  }

  public get variables() {
    return this.data.blocks.Request.variables;
  }

  public setVariable(key: string, value: GraphqlQueryVariableType) {
    this.data.blocks.Request.variables[key] = value;
    return this.save();
  }

  public deleteVariable(key: string) {
    delete this.data.blocks.Request.variables[key];
    return this.save();
  }

  public getVariable(key: string) {
    return this.data.blocks.Request.variables[key];
  }

  public createRootIndexData(): GraphqlIndex {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      method: this.method,
    };
  }

  /**
   * Introspect the GraphQL schema
   */
  public async introspect(): Promise<IntrospectionQuery | null> {
    const response = await this.send({
      query: INTROSPECTION_QUERY,
      operationName: 'IntrospectionQuery',
      variables: undefined,
    });

    if (!response?.ok) {
      return null;
    }

    const schema = await response.json().then(
      (d) => d.data || null,
      () => null,
    );

    if (schema) {
      this.introspectionData = schema;
    }

    return schema;
  }

  public async send(options: GraphqlQueryOptions): Promise<Response | null> {
    if (!this.url) return null;

    if (!('variables' in options)) {
      options.variables = this.variables;
    }

    const { fetch } = this.module.workspace.yasumu;

    const headers = new Headers();

    for (const { key, value } of this.headers) {
      headers.append(key, value);
    }

    this.data.blocks.Request.body = options.query;
    await this.save().catch(console.error);

    const opt = JSON.stringify(options);

    const init: RequestInit & { maxRedirects: number; timeout: number } = {
      method: this.method,
      headers,
      body: this.method === 'GET' ? undefined : opt,
      redirect: 'follow',
      maxRedirects: 5,
      timeout: 60_000,
      signal: AbortSignal.timeout(60_000),
    };

    const url = new URL(this.url);

    if (this.method === GraphqlHttpMethod.Get) {
      url.searchParams.append('query', opt);
    }

    return fetch(url.toString(), init);
  }

  public async execute(options?: ExecutionOptions): Promise<ExecutionResult> {
    return {} as ExecutionResult;
  }
}
