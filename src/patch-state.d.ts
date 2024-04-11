import { StateSignal } from './state-signal';
import { Prettify } from './ts-helpers';
export type PartialStateUpdater<State extends object> = (state: State) => Partial<State>;
export declare function patchState<State extends object>(stateSignal: StateSignal<State>, ...updaters: Array<Partial<Prettify<State>> | PartialStateUpdater<Prettify<State>>>): void;
