import { EmptyFeatureResult, SignalStoreFeature } from './signal-store-models';
export declare function withState<State extends Record<string, unknown>>(state: State): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
export declare function withState<State extends Record<string, unknown>>(stateFactory: () => State): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
