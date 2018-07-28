import { Rule } from '.';
import { Definition, Primitive } from './types';

export function key(): Rule {}
export function immutable(rule?: Rule): Rule {}
export function required(rule?: Rule): Rule {}
export function optional(rule?: Rule): Rule {}
export function indexOf<T>(definition: Definition<T>): Rule {}
export function objectOf<T>(definition: Definition<T>): Rule {}
export function array(): Rule {}
