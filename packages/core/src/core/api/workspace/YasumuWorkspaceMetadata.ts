import type { YasumuWorkspaceEnvironment } from './environments/YasumuEnvironmentsManager.js';
import type { YasumuPartialRestEntity, YasumuRestEntityData, YasumuSmtpMetadata } from './modules/index.js';

export interface YasumuRawWorkspaceMetadata {
  name: string;
  id: string;
  selectedEnvironmentId: string | null;
  environments: YasumuWorkspaceEnvironment[];
  lastOpenedRequests: string[];
  lastOpenedRequest: string | null;
  restEntities: Record<string, YasumuPartialRestEntity>;
  smtp: YasumuSmtpMetadata;
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
   * Update smtp metadata
   * @param metadata The new metadata
   */
  public setSmtpMetadata(metadata: YasumuSmtpMetadata) {
    this.raw.smtp = metadata;
  }

  /**
   * Get the rest entities of the workspace
   */
  public getRestEntities() {
    return this.raw.restEntities ?? [];
  }

  /**
   * Set the rest entities of the workspace
   * @param entities The new entities
   */
  public setRestEntities(entities: Record<string, YasumuPartialRestEntity>) {
    this.raw.restEntities = entities;
  }

  /**
   * Append a rest entity to the workspace
   * @param entity The entity to append
   */
  public appendRestEntity(entity: YasumuPartialRestEntity) {
    this.raw.restEntities[entity.id] = entity;
  }

  /**
   * Delete a rest entity from the workspace
   */
  public deleteRestEntity(identifier: YasumuPartialRestEntity | string) {
    const id = typeof identifier === 'string' ? identifier : identifier.id;
    delete this.raw.restEntities[id];
  }

  /**
   * Get the last opened request
   */
  public get lastOpenedRequest() {
    return this.raw.lastOpenedRequest ?? null;
  }

  /**
   * Set the last opened request
   */
  public setLastOpenedRequest(id: string | null) {
    this.raw.lastOpenedRequest = id;
  }

  /**
   * Get last opened requests
   */
  public get lastOpenedRequests() {
    const data = new Set(this.raw.lastOpenedRequests ?? []);
    return Array.from(data);
  }

  /**
   * Set last opened requests
   */
  public setLastOpenedRequests(requests: string[]) {
    this.raw.lastOpenedRequests = Array.from(new Set(requests));
  }

  /**
   * Get the selected environment ID
   */
  public get selectedEnvironmentId() {
    return this.raw.selectedEnvironmentId ?? null;
  }

  /**
   * Set the selected environment ID
   */
  public setSelectedEnvironmentId(id: string | null) {
    this.raw.selectedEnvironmentId = id;
    this.onChange?.();
  }

  /**
   * Get the environments of the workspace
   */
  public get environments() {
    return this.raw.environments ?? [];
  }

  /**
   * Set the environments of the workspace
   */
  public updateEnvironments(env: YasumuWorkspaceEnvironment[]) {
    this.raw.environments = env;
  }

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
   * Transform the metadata into a JSON object
   * @returns The raw metadata
   */
  public toJSON() {
    return this.raw;
  }
}
