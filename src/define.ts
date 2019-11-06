import { Definition, Rule, Patch } from '.';
import { DELETE_VALUE } from './types';

/**
 * Creates a definition for a type.  These definitions are required arguments for most of
 * the Standard Functions. Any operation that adds a property not included in the definition
 * will be ignored without throwing an error. Properties are ignored independently.
 * @param rules An object that respresents the property and property rules for a given type.
 * @returns Returns a Definition object.
 */
export function define<T = any>(
  rules: { [K in keyof T]: Rule },
): Definition<T> {
  const keys = Object.keys(rules);

  const keyName = keys.find(key => rules[key].isKey);

  return {
    getPayload: createGetPayloadFunction(rules),
    getPatch: createGetPatchFunction(rules),
    getKey: item => item[keyName],
    getDefinitions: key => {
      const rule = rules[key];

      if (!rule) return undefined;

      const { object, index, isArray } = rule;

      return { object, index, isArray };
    },
  };
}

export function dynamic(getKey?: () => string): Definition<any> {
  return {
    getKey: getKey || (() => null),
    getPatch: x => x,
    getPayload: x => x,
    getDefinitions: () => ({}),
  };
}

function createGetPayloadFunction<T>(
  rules: { [K in keyof T]: Rule },
): (payload: T) => T {
  return payload => {
    const result = {};

    let hasAny = false;
    let hasAnyRequred = false;

    for (const key of Object.keys(rules)) {
      const rule: Rule = rules[key];
      if (!rule) continue;
      if (payload[key] === DELETE_VALUE) return undefined;

      if (rule.isReadonly) {
        hasAnyRequred = true;
      }

      if (typeof payload[key] === 'undefined' || payload[key] === null) {
        if (rule.isRequired) {
          if (rule.isArray) {
            hasAny = true;
            result[key] = [];
          } else if (rule.index) {
            hasAny = true;
            result[key] = {};
          } else {
            return undefined;
          }
        }
      } else {
        if (rule.object) {
          const childPayload = rule.object.getPayload(payload[key]);

          if (childPayload) {
            hasAny = true;
            result[key] = childPayload;
          } else if (rule.isRequired) {
            return undefined;
          }
        } else if (rule.index) {
          hasAny = true;
          result[key] = {};
          for (const childKey in payload[key]) {
            const childPayload = rule.index.getPayload(payload[key][childKey]);
            if (childPayload) result[key][childKey] = childPayload;
          }
        } else {
          hasAny = true;
          result[key] = payload[key];
        }
      }
    }

    return hasAny || !hasAnyRequred ? (result as T) : undefined;
  };
}

function createGetPatchFunction<T>(
  rules: { [K in keyof T]: Rule },
): (payload: T) => Patch<T> {
  return payload => {
    const patch = {};

    let hasAny = false;

    for (const key of Object.keys(rules)) {
      const rule: Rule = rules[key];
      if (!rule) continue;

      if (payload[key] === DELETE_VALUE) {
        if (!rule.isReadonly && !rule.isRequired) {
          hasAny = true;
          patch[key] = DELETE_VALUE;
        }
      } else {
        if (
          !rule.isReadonly &&
          typeof payload[key] !== 'undefined' &&
          payload[key] !== null &&
          (!rule.isArray || Array.isArray(payload[key]))
        ) {
          hasAny = true;
          patch[key] = payload[key];
        }
      }
    }

    return hasAny ? patch : undefined;
  };
}
