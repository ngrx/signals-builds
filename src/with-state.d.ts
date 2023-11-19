import { EmptyFeatureResult, SignalStoreFeature } from './signal-store-models';
export declare function withState<State extends object>(stateFactory: () => State): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
export declare function withState<State extends object>(state: State): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
