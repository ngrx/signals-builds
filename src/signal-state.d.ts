import { StateSignal } from './state-signal';
import { DeepSignal } from './deep-signal';
type SignalState<State extends object> = DeepSignal<State> & StateSignal<State>;
export declare function signalState<State extends object>(initialState: State): SignalState<State>;
export {};
