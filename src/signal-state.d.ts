import { WritableSignal } from '@angular/core';
import { DeepSignal } from './deep-signal';
export declare const STATE_SIGNAL: unique symbol;
export type SignalStateMeta<State extends Record<string, unknown>> = {
    [STATE_SIGNAL]: WritableSignal<State>;
};
type SignalState<State extends Record<string, unknown>> = DeepSignal<State> & SignalStateMeta<State>;
export declare function signalState<State extends Record<string, unknown>>(initialState: State): SignalState<State>;
export {};
