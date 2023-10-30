import { EmptyFeatureResult, SignalStoreFeature } from './signal-store-models';
import { HasNestedFunctionKeys, HasOptionalProps, IsUnknownRecord } from './ts-helpers';
type WithStateCheck<State> = IsUnknownRecord<State> extends true ? '@ngrx/signals: root state keys must be string literals' : HasOptionalProps<State> extends true ? '@ngrx/signals: root state slices cannot be optional' : HasNestedFunctionKeys<State> extends false | undefined ? unknown : '@ngrx/signals: nested state slices cannot contain `Function` property or method names';
export declare function withState<State extends Record<string, unknown>>(state: State & WithStateCheck<State>): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
export declare function withState<State extends Record<string, unknown>>(stateFactory: () => State & WithStateCheck<State>): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult & {
    state: State;
}>;
export {};
