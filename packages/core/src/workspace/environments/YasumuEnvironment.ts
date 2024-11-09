import { deepMerge, generateId } from '@/common/utils.js';
import type { YasumuEnvironmentManager } from './YasumuEnvironmentManager.js';

export interface CreateEnvironmentOptions {
  /**
   * Environment id for this environment.
   */
  id?: string;
  /**
   * The name of the environment.
   */
  name?: string;
}

export interface YasumuEnvironmentEntity {
  /**
   * The entity name
   */
  name: string;
  /**
   * The entity id
   */
  id: string;
  /**
   * The entity creation date
   */
  createdAt: number;
  /**
   * The entity variables
   */
  variables: YasumuEnvironmentVariable[];
  /**
   * The entity secrets
   */
  secrets: YasumuEnvironmentSecret[];
}

export interface YasumuEnvironmentVariable {
  /**
   * The variable key
   */
  key: string;
  /**
   * The variable value
   */
  value: string;
  /**
   * Whether the variable is enabled
   */
  enabled: boolean;
}

export interface YasumuEnvironmentSecret {
  /**
   * The secret key
   */
  key: string;
  /**
   * Whether the secret is enabled
   */
  enabled: boolean;
}

export type YasumuEnvironmentEntityData = Record<string, YasumuEnvironmentEntity>;

export class YasumuEnvironment {
  private data!: YasumuEnvironmentEntity;
  public constructor(
    public readonly manager: YasumuEnvironmentManager,
    data: Partial<YasumuEnvironmentEntity>,
  ) {
    this.#reformat(data);
  }

  #reformat(data: Partial<YasumuEnvironmentEntity>) {
    this.data ??= deepMerge({}, data);
    this.data.createdAt ??= Date.now();
    this.data.id ??= generateId();
    this.data.name ??= 'Untitled environment';
    this.data.variables ??= [];
    this.data.secrets ??= [];

    console.log(this.data);
  }

  /**
   * The creation date of this environment.
   */
  public get createdAt(): Date {
    return new Date(this.data.createdAt);
  }

  /**
   * The creation timestamp of this environment.
   */
  public get createdAtTimestamp(): number {
    return this.data.createdAt;
  }

  /**
   * The ID of this environment.
   */
  public get id(): string {
    return this.data.id;
  }

  /**
   * The name of this environment.
   */
  public get name(): string {
    return this.data.name;
  }

  /**
   * Sets the name of this environment.
   * @param name The new name.
   */
  public setName(name: string) {
    this.data.name = name;
  }

  /**
   * Delete this environment.
   */
  public async delete() {
    return this.manager.deleteEnvironment(this.data.id);
  }

  /**
   * Clone this environment.
   */
  public async clone() {
    const newName = this.data.name.replace(/(\d+)?$/, (match, num) => {
      if (num) return String(Number(num) + 1);
      return ' 2';
    });

    return this.manager.createEnvironment({
      name: newName,
      id: generateId(),
    });
  }

  /**
   * Get the variable by its key.
   * @param key The variable key.
   * @returns The variable.
   */
  public async getVariable(key: string): Promise<YasumuEnvironmentVariable | null> {
    return this.data.variables.find((variable) => variable.key === key) ?? null;
  }

  /**
   * Get the secret by its key.
   * @param key The secret key.
   * @returns The secret.
   */
  public async getSecret(key: string): Promise<(YasumuEnvironmentSecret & { value: string }) | null> {
    const secret = this.data.secrets.find((variable) => variable.key === key) ?? null;
    if (!secret) return null;

    return {
      ...secret,
      value: (await this.manager.workspace.yasumu.store.get(this.#getKey(key))) ?? '',
    };
  }

  /**
   * Update the variable by its key if it exists.
   * @param data The new variable data.
   */
  public async updateVariable(key: string, data: Partial<YasumuEnvironmentVariable>) {
    const variable = this.getVariable(key);

    if (variable) {
      Object.assign(variable, data);
    }

    return this.save();
  }

  /**
   * Update the secret by its key if it exists.
   * @param data The new secret data.
   */
  public async updateSecret(
    key: string,
    data: Partial<
      YasumuEnvironmentSecret & {
        value: string;
      }
    >,
  ) {
    const secret = await this.getSecret(key);

    if (secret) {
      Object.assign(secret, data);
      if (secret.value !== data.value) {
        const storeKey = this.#getKey(data.key || key);
        const store = this.manager.workspace.yasumu.store;

        await store.set(storeKey, data.value);
      }
    }

    return this.save();
  }

  /**
   * Select this environment.
   */
  public async select() {
    await this.manager.selectEnvironment(this.data.id);
  }

  /**
   * Unselect this environment.
   */
  public async unselect() {
    await this.manager.selectEnvironment('');
  }

  /**
   * Add a new variable to this environment.
   * @param key The variable key.
   * @param value The variable value.
   */
  public async addVariable(variable: Partial<YasumuEnvironmentVariable>) {
    if (this.data.variables.some((v) => v.key === variable.key)) return;

    this.data.variables.push({
      enabled: variable.enabled ?? true,
      key: variable.key ?? '',
      value: variable.value ?? '',
    });

    await this.save();
  }

  /**
   * Add a new variable to this environment.
   * @param key The variable key.
   * @param value The variable value.
   */
  public async addSecret(
    secret: Partial<
      YasumuEnvironmentSecret & {
        value: string;
      }
    >,
  ) {
    if (this.data.secrets.some((v) => v.key === secret.key)) return;

    this.data.secrets.push({
      enabled: secret.enabled ?? true,
      key: secret.key ?? '',
    });

    if (secret.key && secret.value) {
      const workspace = this.manager.workspace;
      await workspace.yasumu.store.set(this.#getKey(secret.key), secret.value);
    }

    await this.save();
  }

  #getKey(key: string) {
    return `secrets::${this.manager.workspace.getMetadata().id}::${this.data.id}::${key}`;
  }

  /**
   * Save this environment.
   */
  public async save() {
    const metadata = this.manager.workspace.getMetadata();
    const data = metadata.getRawData();

    data.blocks.Environment.environments[this.data.id] = this.toJSON();

    await metadata.save();
  }

  /**
   * JSON representation of this environment.
   */
  public toJSON(): YasumuEnvironmentEntity {
    return this.data;
  }
}
