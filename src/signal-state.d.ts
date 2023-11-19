import { WritableSignal } from '@angular/core';
import { DeepSignal } from './deep-signal';
export declare const STATE_SIGNAL: unique symbol;
export type SignalStateMeta<State extends object> = {
    [STATE_SIGNAL]: WritableSignal<State>;
};
type SignalState<State extends object> = DeepSignal<State> & SignalStateMeta<State>;
export declare function signalState<State extends object>(initialState: State): SignalState<State>;
export {};
