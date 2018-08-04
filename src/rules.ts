import { Rule } from '.';
import { Definition, Primitive } from './types';

export function key(): Rule {
  return { isKey: true, isReadonly: true, isRequired: true };
}
export function immutable(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: true,
    isRequired: rule ? rule.isRequired : true,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}

export function required(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: rule ? rule.isReadonly : undefined,
    isRequired: true,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}

export function optional(rule?: Rule): Rule {
  return {
    isKey: rule ? rule.isKey : false,
    isReadonly: rule ? rule.isReadonly : undefined,
    isRequired: false,
    isArray: rule ? rule.isArray : undefined,
    index: rule ? rule.index : undefined,
    object: rule ? rule.object : undefined,
  };
}

export function indexOf<T>(definition: Definition<T>): Rule<T> {
  return { isKey: false, index: definition };
}
export function objectOf<T>(definition: Definition<T>): Rule<T> {
  return { isKey: false, object: definition };
}
export function array(): Rule {
  return { isKey: false, isArray: true };
}
