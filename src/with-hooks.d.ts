import { StateSignal } from './state-signal';
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult, SignalStoreSlices } from './signal-store-models';
import { Prettify } from './ts-helpers';
type HooksFactory<Input extends SignalStoreFeatureResult> = (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals'] & Input['methods'] & StateSignal<Prettify<Input['state']>>>) => void;
export declare function withHooks<Input extends SignalStoreFeatureResult>(hooks: {
    onInit?: HooksFactory<Input>;
    onDestroy?: HooksFactory<Input>;
}): SignalStoreFeature<Input, EmptyFeatureResult>;
export {};
