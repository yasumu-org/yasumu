import type { YasumuWorkspace } from '../YasumuWorkspace.js';
import { YasumuEnvironment } from './YasumuEnvironment.js';

export const YasumuEnvironmentVariableType = {
  Secret: 'Secret',
  Variable: 'Variable',
} as const;

export type YasumuEnvironmentVariableType =
  (typeof YasumuEnvironmentVariableType)[keyof typeof YasumuEnvironmentVariableType];

export interface YasumuEnvironmentVariable {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  type: YasumuEnvironmentVariableType;
}

export interface YasumuWorkspaceEnvironment {
  id: string;
  name: string;
  description?: string;
  variables: YasumuEnvironmentVariable[];
}

export class YasumuEnvironmentsManager {
  public constructor(public readonly workspace: YasumuWorkspace) {}

  public getSelectedEnvironmentId(): string | null {
    return this.workspace.metadata.selectedEnvironmentId;
  }

  public getSelectedEnvironment(): YasumuEnvironment | null {
    const id = this.workspace.metadata.selectedEnvironmentId;

    if (!id) {
      return null;
    }

    const environment = this.environments.find((env) => env.id === id);

    if (!environment) {
      return null;
    }

    return new YasumuEnvironment(this, environment);
  }

  public selectEnvironment(id: string | null): Promise<void> {
    this.workspace.metadata.setSelectedEnvironmentId(id);
    return this.workspace.writeMetadata();
  }

  public get environments(): YasumuWorkspaceEnvironment[] {
    return this.workspace.metadata.environments;
  }

  public getEnvironments(): YasumuEnvironment[] {
    return this.environments.map((env) => {
      const environment = new YasumuEnvironment(this, env);

      return environment;
    });
  }

  public async setEnvironments(env: YasumuWorkspaceEnvironment[]): Promise<void> {
    const updated = await this._updateVariables(env);
    this.workspace.metadata.updateEnvironments(updated);
    return this.workspace.writeMetadata();
  }

  private async _updateVariables(env: YasumuWorkspaceEnvironment[]): Promise<YasumuWorkspaceEnvironment[]> {
    return Promise.all(
      env.map(async (env) => {
        const variables = await Promise.all(
          env.variables.map(async (variable) => {
            if (variable.type === YasumuEnvironmentVariableType.Variable) {
              return variable;
            }

            await this.workspace.secrets.set(variable.id, variable.value).catch(Object);

            return {
              ...variable,
              value: '',
            };
          }),
        );

        return {
          ...env,
          variables,
        };
      }),
    );
  }
}
