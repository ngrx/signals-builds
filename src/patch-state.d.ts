import { SignalStateMeta } from './signal-state';
export type PartialStateUpdater<State extends object> = (state: State) => Partial<State>;
export declare function patchState<State extends object>(signalState: SignalStateMeta<State>, ...updaters: Array<Partial<State & {}> | PartialStateUpdater<State & {}>>): void;
