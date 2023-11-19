import { SignalStateMeta } from './signal-state';
export declare function getState<State extends Record<string, unknown>>(signalState: SignalStateMeta<State>): State;
