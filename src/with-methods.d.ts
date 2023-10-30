import { SignalStateMeta } from './signal-state';
import { EmptyFeatureResult, MethodsDictionary, SignalStoreFeature, SignalStoreFeatureResult, SignalStoreSlices } from './signal-store-models';
import { Prettify } from './ts-helpers';
export declare function withMethods<Input extends SignalStoreFeatureResult, Methods extends MethodsDictionary>(methodsFactory: (store: Prettify<SignalStoreSlices<Input['state']> & Input['signals'] & Input['methods'] & SignalStateMeta<Prettify<Input['state']>>>) => Methods): SignalStoreFeature<Input, EmptyFeatureResult & {
    methods: Methods;
}>;
