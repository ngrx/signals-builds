import * as i0 from '@angular/core';
import { untracked, isSignal, computed, signal, DestroyRef, inject, Injectable } from '@angular/core';

const STATE_SIGNAL = Symbol('STATE_SIGNAL');

function getState(stateSignal) {
    return stateSignal[STATE_SIGNAL]();
}

function patchState(stateSignal, ...updaters) {
    stateSignal[STATE_SIGNAL].update((currentState) => updaters.reduce((nextState, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
    }), currentState));
}

function toDeepSignal(signal) {
    const value = untracked(() => signal());
    if (!isRecord(value)) {
        return signal;
    }
    return new Proxy(signal, {
        get(target, prop) {
            if (!(prop in value)) {
                return target[prop];
            }
            if (!isSignal(target[prop])) {
                Object.defineProperty(target, prop, {
                    value: computed(() => target()[prop]),
                    configurable: true,
                });
            }
            return toDeepSignal(target[prop]);
        },
    });
}
function isRecord(value) {
    return value?.constructor === Object;
}

function signalState(initialState) {
    const stateSignal = signal(initialState);
    const deepSignal = toDeepSignal(stateSignal.asReadonly());
    Object.defineProperty(deepSignal, STATE_SIGNAL, {
        value: stateSignal,
    });
    return deepSignal;
}

function signalStore(...args) {
    const signalStoreArgs = [...args];
    const config = 'providedIn' in signalStoreArgs[0]
        ? signalStoreArgs.shift()
        : {};
    const features = signalStoreArgs;
    class SignalStore {
        constructor() {
            const innerStore = features.reduce((store, feature) => feature(store), getInitialInnerStore());
            const { slices, signals, methods, hooks } = innerStore;
            const props = { ...slices, ...signals, ...methods };
            this[STATE_SIGNAL] = innerStore[STATE_SIGNAL];
            for (const key in props) {
                this[key] = props[key];
            }
            const { onInit, onDestroy } = hooks;
            if (onInit) {
                onInit();
            }
            if (onDestroy) {
                inject(DestroyRef).onDestroy(onDestroy);
            }
        }
        /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: SignalStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
        /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: SignalStore, providedIn: config.providedIn || null });
    }
    i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: SignalStore, decorators: [{
                type: Injectable,
                args: [{ providedIn: config.providedIn || null }]
            }], ctorParameters: () => [] });
    return SignalStore;
}
function getInitialInnerStore() {
    return {
        [STATE_SIGNAL]: signal({}),
        slices: {},
        signals: {},
        methods: {},
        hooks: {},
    };
}

function signalStoreFeature(featureOrInput, ...restFeatures) {
    const features = typeof featureOrInput === 'function'
        ? [featureOrInput, ...restFeatures]
        : restFeatures;
    return (inputStore) => features.reduce((store, feature) => feature(store), inputStore);
}
function type() {
    return undefined;
}

function excludeKeys(obj, keys) {
    return Object.keys(obj).reduce((acc, key) => {
        if (!keys.includes(key)) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

function withComputed(signalsFactory) {
    return (store) => {
        const signals = signalsFactory({ ...store.slices, ...store.signals });
        const signalsKeys = Object.keys(signals);
        const slices = excludeKeys(store.slices, signalsKeys);
        const methods = excludeKeys(store.methods, signalsKeys);
        return {
            ...store,
            slices,
            signals: { ...store.signals, ...signals },
            methods,
        };
    };
}

function withHooks(hooksOrFactory) {
    return (store) => {
        const storeProps = {
            [STATE_SIGNAL]: store[STATE_SIGNAL],
            ...store.slices,
            ...store.signals,
            ...store.methods,
        };
        const hooks = typeof hooksOrFactory === 'function'
            ? hooksOrFactory(storeProps)
            : hooksOrFactory;
        const createHook = (name) => {
            const hook = hooks[name];
            const currentHook = store.hooks[name];
            return hook
                ? () => {
                    if (currentHook) {
                        currentHook();
                    }
                    hook(storeProps);
                }
                : currentHook;
        };
        return {
            ...store,
            hooks: {
                onInit: createHook('onInit'),
                onDestroy: createHook('onDestroy'),
            },
        };
    };
}

function withMethods(methodsFactory) {
    return (store) => {
        const methods = methodsFactory({
            [STATE_SIGNAL]: store[STATE_SIGNAL],
            ...store.slices,
            ...store.signals,
            ...store.methods,
        });
        const methodsKeys = Object.keys(methods);
        const slices = excludeKeys(store.slices, methodsKeys);
        const signals = excludeKeys(store.signals, methodsKeys);
        return {
            ...store,
            slices,
            signals,
            methods: { ...store.methods, ...methods },
        };
    };
}

function withState(stateOrFactory) {
    return (store) => {
        const state = typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
        const stateKeys = Object.keys(state);
        store[STATE_SIGNAL].update((currentState) => ({
            ...currentState,
            ...state,
        }));
        const slices = stateKeys.reduce((acc, key) => {
            const slice = computed(() => store[STATE_SIGNAL]()[key]);
            return { ...acc, [key]: toDeepSignal(slice) };
        }, {});
        const signals = excludeKeys(store.signals, stateKeys);
        const methods = excludeKeys(store.methods, stateKeys);
        return {
            ...store,
            slices: { ...store.slices, ...slices },
            signals,
            methods,
        };
    };
}

/**
 * Generated bundle index. Do not edit.
 */

export { getState, patchState, signalState, signalStore, signalStoreFeature, type, withComputed, withHooks, withMethods, withState };
//# sourceMappingURL=ngrx-signals.mjs.map
