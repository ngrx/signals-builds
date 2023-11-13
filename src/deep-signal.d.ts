import { Signal as NgSignal } from '@angular/core';
import { IsUnknownRecord } from './ts-helpers';
interface Signal<T> extends NgSignal<T> {
    name: unknown;
    length: unknown;
}
export type DeepSignal<T> = Signal<T> & (T extends Record<string, unknown> ? IsUnknownRecord<T> extends true ? unknown : Readonly<{
    [K in keyof T]: T[K] extends Record<string, unknown> ? IsUnknownRecord<T[K]> extends true ? Signal<T[K]> : DeepSignal<T[K]> : Signal<T[K]>;
}> : unknown);
export declare function toDeepSignal<T>(signal: Signal<T>): DeepSignal<T>;
export {};
