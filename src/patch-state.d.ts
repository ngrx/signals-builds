import { StateSignal } from './state-signal';
export type PartialStateUpdater<State extends object> = (state: State) => Partial<State>;
export declare function patchState<State extends object>(stateSignal: StateSignal<State>, ...updaters: Array<Partial<State & {}> | PartialStateUpdater<State & {}>>): void;
