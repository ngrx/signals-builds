import { WritableSignal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { HasFunctionKeys } from './ts-helpers';
export declare const STATE_SIGNAL: unique symbol;
export type SignalStateMeta<State extends Record<string, unknown>> = {
    [STATE_SIGNAL]: WritableSignal<State>;
};
type SignalStateCheck<State> = HasFunctionKeys<State> extends false | undefined ? unknown : '@ngrx/signals: signal state cannot contain `Function` property or method names';
type SignalState<State extends Record<string, unknown>> = DeepSignal<State> & SignalStateMeta<State>;
export declare function signalState<State extends Record<string, unknown>>(initialState: State & SignalStateCheck<State>): SignalState<State>;
export {};
