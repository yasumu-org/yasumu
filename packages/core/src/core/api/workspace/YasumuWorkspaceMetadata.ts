import type { HttpMethods } from '@/core/common/constants.js';
import type { YasumuMail } from './modules/index.js';

export interface YasumuRawWorkspaceMetadataEnvironment {
  name: string;
  id: string;
  variables: Record<string, string>;
  // secrets are stored as a list of keys and fetched from workspace's kv store
  secrets: Array<string>;
}

export interface YasumuRawWorkspaceMetadataRest {
  children?: YasumuRawWorkspaceMetadataRest[];
  id: string;
  name: string;
  method: HttpMethods | null;
}

export interface YasumuRawWorkspaceMetadataSmtp {
  port: number;
  emails: Omit<YasumuMail, 'body'>[];
}

export interface YasumuRawWorkspaceMetadata {
  name: string;
  id: string;
  createdAt: string;
  environment: YasumuRawWorkspaceMetadataEnvironment[];
  rest: YasumuRawWorkspaceMetadataRest[];
  smtp: YasumuRawWorkspaceMetadataSmtp;
}

export class YasumuWorkspaceMetadata {
  /**
   * The callback to call when the metadata changes
   */
  public onChange: (() => unknown) | null = null;

  /**
   * Create a new YasumuWorkspaceMetadata instance
   * @param raw The raw metadata
   */
  public constructor(private readonly raw: YasumuRawWorkspaceMetadata) {}

  /**
   * Get the ID of the workspace
   */
  public get id() {
    return this.raw.id;
  }

  /**
   * Get the name of the workspace
   */
  public get name() {
    return this.raw.name;
  }

  /**
   * Set the name of the workspace
   * @param name The new name
   */
  public setName(name: string) {
    this.raw.name = name;
    this.onChange?.();
  }

  /**
   * Get the creation date of the workspace
   */
  public get createdAt() {
    return new Date(this.raw.createdAt);
  }

  /**
   * Get the static reference to the environment configuration
   */
  public get environment() {
    return this.raw.environment;
  }

  /**
   * Get the static reference to the REST configuration
   */
  public get rest() {
    return this.raw.rest;
  }

  /**
   * Get the static reference to the SMTP configuration
   */
  public get smtp() {
    return this.raw.smtp;
  }

  /**
   * Transform the metadata into a JSON object
   * @returns The raw metadata
   */
  public toJSON() {
    return this.raw;
  }
}
