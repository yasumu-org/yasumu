import {
  YasumuEnvironmentVariableType,
  type YasumuEnvironmentsManager,
  type YasumuWorkspaceEnvironment,
} from './YasumuEnvironmentsManager.js';

export class YasumuEnvironment {
  public constructor(
    public readonly manager: YasumuEnvironmentsManager,
    private readonly data: YasumuWorkspaceEnvironment,
  ) {}

  public get id() {
    return this.data.id;
  }

  public get name() {
    return this.data.name;
  }

  public get description() {
    return this.data.description;
  }

  public async getData() {
    const variables = this.data.variables;

    const fetchedVariables = await Promise.all(
      variables.map(async (variable) => {
        if (variable.type === YasumuEnvironmentVariableType.Variable) {
          return variable;
        }

        const value = String(await this.manager.workspace.secrets.get<string>(variable.id).catch(() => ''));

        variable.value = value;

        return {
          ...variable,
          value,
        };
      }),
    );

    return {
      ...this.data,
      variables: fetchedVariables,
    };
  }
}
