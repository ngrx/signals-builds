import { EmptyFeatureResult, SignalsDictionary, SignalStoreFeature, SignalStoreFeatureResult, SignalStoreSlices } from './signal-store-models';
import { Prettify } from './ts-helpers';
export declare function withComputed<Input extends SignalStoreFeatureResult, Signals extends SignalsDictionary>(signalsFactory: (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals']>) => Signals): SignalStoreFeature<Input, EmptyFeatureResult & {
    signals: Signals;
}>;
