import { StateSignal } from './state-signal';
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult, SignalStoreSlices } from './signal-store-models';
import { Prettify } from './ts-helpers';
type HookFn<Input extends SignalStoreFeatureResult> = (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals'] & Input['methods'] & StateSignal<Prettify<Input['state']>>>) => void;
type HooksFactory<Input extends SignalStoreFeatureResult> = (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals'] & Input['methods'] & StateSignal<Prettify<Input['state']>>>) => {
    onInit?: () => void;
    onDestroy?: () => void;
};
export declare function withHooks<Input extends SignalStoreFeatureResult>(hooks: {
    onInit?: HookFn<Input>;
    onDestroy?: HookFn<Input>;
}): SignalStoreFeature<Input, EmptyFeatureResult>;
export declare function withHooks<Input extends SignalStoreFeatureResult>(hooks: HooksFactory<Input>): SignalStoreFeature<Input, EmptyFeatureResult>;
export {};
