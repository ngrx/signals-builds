import { StateSignal } from './state-signal';
import { EmptyFeatureResult, MethodsDictionary, SignalStoreFeature, SignalStoreFeatureResult, StateSignals } from './signal-store-models';
import { Prettify } from './ts-helpers';
export declare function withMethods<Input extends SignalStoreFeatureResult, Methods extends MethodsDictionary>(methodsFactory: (store: Prettify<StateSignals<Input['state']> & Input['computed'] & Input['methods'] & StateSignal<Prettify<Input['state']>>>) => Methods): SignalStoreFeature<Input, EmptyFeatureResult & {
    methods: Methods;
}>;
