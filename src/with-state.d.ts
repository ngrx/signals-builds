import { EmptyFeatureResult, SignalStoreFeature } from './signal-store-models';
export declare function withState<State extends object>(stateFactory: () => State): SignalStoreFeature<EmptyFeatureResult, {
    state: State;
    computed: {};
    methods: {};
}>;
export declare function withState<State extends object>(state: State): SignalStoreFeature<EmptyFeatureResult, {
    state: State;
    computed: {};
    methods: {};
}>;
