import { YasumuVariables } from './variables';

export class YasumuEnvironment {
  #environments = new Map<string, YasumuVariables>();
  #active: string | null = null;

  public use(name: string) {
    if (!this.#environments.has(name)) return;
    this.#active = name;
  }

  public isActive(name: string) {
    return this.#active === name;
  }

  public get active() {
    return this.#active;
  }

  public get count() {
    return this.#environments.size;
  }

  public get(name: string) {
    return this.#environments.get(name);
  }

  public has(name: string) {
    return this.#environments.has(name);
  }

  public create(name: string) {
    if (this.#environments.has(name)) return;
    this.#environments.set(name, new YasumuVariables());
  }

  public delete(name: string) {
    this.#environments.delete(name);
  }

  public rename(oldName: string, newName: string) {
    if (!this.#environments.has(oldName)) return;
    if (this.#environments.has(newName)) return;

    const env = this.#environments.get(oldName)!;

    this.#environments.delete(oldName);
    this.#environments.set(newName, env);
  }

  public duplicate(name: string, newName: string) {
    if (!this.#environments.has(name)) return;
    if (this.#environments.has(newName)) return;

    const env = this.#environments.get(name)!;
    this.#environments.set(newName, env.clone());
  }
}
