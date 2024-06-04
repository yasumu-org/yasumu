export const AuthorizationType = {
  Inherit: 'Inherit',
  NoAuth: 'NoAuth',
  BasicAuth: 'Basic',
  BearerToken: 'Bearer',
} as const;
export type AuthorizationType =
  (typeof AuthorizationType)[keyof typeof AuthorizationType];

export interface YasumuAuthorization {
  name: string;
  value: string;
}

export class YasumuRequestAuthorization {
  public type: AuthorizationType = AuthorizationType.Inherit;
  public value?: string;

  public constructor(public readonly parent?: YasumuRequestAuthorization) {}

  public getPrefix(): string {
    switch (this.type) {
      case AuthorizationType.Inherit:
        return this.parent?.getPrefix() ?? '';
      case AuthorizationType.BasicAuth:
        return 'Basic';
      case AuthorizationType.BearerToken:
        return 'Bearer';
      default:
        return '';
    }
  }

  public getValue(): string {
    if (this.type === AuthorizationType.NoAuth) return '';
    if (this.type === AuthorizationType.Inherit)
      return this.parent?.getValue() ?? '';
    return this.value ?? '';
  }

  public serialize(): YasumuAuthorization | null {
    if (this.type === AuthorizationType.NoAuth) return null;
    if (!this.value) return null;

    const value = [this.getPrefix(), this.getValue()].filter(Boolean).join(' ');
    if (!value) return null;

    return {
      name: 'Authorization',
      value,
    };
  }
}
