import { customAlphabet, urlAlphabet } from 'nanoid';

const nanoid = customAlphabet(urlAlphabet, 21);

/**
 * Generate a random id
 * @returns The generated id
 */
export function generateId() {
  return nanoid();
}

/**
 * Deep merge two objects
 * @param target The target object
 * @param source The source object
 */
export const deepMerge = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] instanceof Object) {
      if (!target[key]) {
        if (Array.isArray(source[key])) {
          target[key] = source[key].slice();
          continue;
        }

        Object.assign(target, { [key]: {} });
      }
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return target;
};
