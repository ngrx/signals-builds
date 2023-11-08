import { SignalStateMeta } from './signal-state';
export type PartialStateUpdater<State extends Record<string, unknown>> = (state: State) => Partial<State>;
export declare function patchState<State extends Record<string, unknown>>(signalState: SignalStateMeta<State>, ...updaters: Array<Partial<State & {}> | PartialStateUpdater<State & {}>>): void;
