import { SignalStateMeta } from './signal-state';
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreSlices, SignalStoreFeatureResult } from './signal-store-models';
import { Prettify } from './ts-helpers';
type HooksFactory<Input extends SignalStoreFeatureResult> = (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals'] & Input['methods'] & SignalStateMeta<Prettify<Input['state']>>>) => void;
export declare function withHooks<Input extends SignalStoreFeatureResult>(hooks: {
    onInit?: HooksFactory<Input>;
    onDestroy?: HooksFactory<Input>;
}): SignalStoreFeature<Input, EmptyFeatureResult>;
export {};
