import * as i0 from '@angular/core';
import { untracked, isSignal, computed, assertInInjectionContext, inject, Injector, DestroyRef, signal, Injectable } from '@angular/core';

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

function deepComputed(computation) {
    return toDeepSignal(computed(computation));
}

const STATE_WATCHERS = new WeakMap();
const STATE_SOURCE = Symbol('STATE_SOURCE');
function patchState(stateSource, ...updaters) {
    stateSource[STATE_SOURCE].update((currentState) => updaters.reduce((nextState, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
    }), currentState));
    notifyWatchers(stateSource);
}
function getState(stateSource) {
    return stateSource[STATE_SOURCE]();
}
function watchState(stateSource, watcher, config) {
    if (!config?.injector) {
        assertInInjectionContext(watchState);
    }
    const injector = config?.injector ?? inject(Injector);
    const destroyRef = injector.get(DestroyRef);
    addWatcher(stateSource, watcher);
    watcher(getState(stateSource));
    const destroy = () => removeWatcher(stateSource, watcher);
    destroyRef.onDestroy(destroy);
    return { destroy };
}
function getWatchers(stateSource) {
    return STATE_WATCHERS.get(stateSource[STATE_SOURCE]) || [];
}
function notifyWatchers(stateSource) {
    const watchers = getWatchers(stateSource);
    for (const watcher of watchers) {
        const state = untracked(() => getState(stateSource));
        watcher(state);
    }
}
function addWatcher(stateSource, watcher) {
    const watchers = getWatchers(stateSource);
    STATE_WATCHERS.set(stateSource[STATE_SOURCE], [...watchers, watcher]);
}
function removeWatcher(stateSource, watcher) {
    const watchers = getWatchers(stateSource);
    STATE_WATCHERS.set(stateSource[STATE_SOURCE], watchers.filter((w) => w !== watcher));
}

function signalState(initialState) {
    const stateSource = signal(initialState);
    const signalState = toDeepSignal(stateSource.asReadonly());
    Object.defineProperty(signalState, STATE_SOURCE, {
        value: stateSource,
    });
    return signalState;
}

function signalStore(...args) {
    const signalStoreArgs = [...args];
    const config = typeof signalStoreArgs[0] === 'function'
        ? {}
        : signalStoreArgs.shift();
    const features = signalStoreArgs;
    class SignalStore {
        constructor() {
            const innerStore = features.reduce((store, feature) => feature(store), getInitialInnerStore());
            const { stateSignals, computedSignals, methods, hooks } = innerStore;
            const storeMembers = { ...stateSignals, ...computedSignals, ...methods };
            this[STATE_SOURCE] = innerStore[STATE_SOURCE];
            for (const key in storeMembers) {
                this[key] = storeMembers[key];
            }
            const { onInit, onDestroy } = hooks;
            if (onInit) {
                onInit();
            }
            if (onDestroy) {
                inject(DestroyRef).onDestroy(onDestroy);
            }
        }
        /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: SignalStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
        /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: SignalStore, providedIn: config.providedIn || null });
    }
    i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: SignalStore, decorators: [{
                type: Injectable,
                args: [{ providedIn: config.providedIn || null }]
            }], ctorParameters: () => [] });
    return SignalStore;
}
function getInitialInnerStore() {
    return {
        [STATE_SOURCE]: signal({}),
        stateSignals: {},
        computedSignals: {},
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

function assertUniqueStoreMembers(store, newMemberKeys) {
    if (!ngDevMode) {
        return;
    }
    const storeMembers = {
        ...store.stateSignals,
        ...store.computedSignals,
        ...store.methods,
    };
    const overriddenKeys = Object.keys(storeMembers).filter((memberKey) => newMemberKeys.includes(memberKey));
    if (overriddenKeys.length > 0) {
        console.warn('@ngrx/signals: SignalStore members cannot be overridden.', 'Trying to override:', overriddenKeys.join(', '));
    }
}

function withComputed(signalsFactory) {
    return (store) => {
        const computedSignals = signalsFactory({
            ...store.stateSignals,
            ...store.computedSignals,
        });
        assertUniqueStoreMembers(store, Object.keys(computedSignals));
        return {
            ...store,
            computedSignals: { ...store.computedSignals, ...computedSignals },
        };
    };
}

function withHooks(hooksOrFactory) {
    return (store) => {
        const storeMembers = {
            [STATE_SOURCE]: store[STATE_SOURCE],
            ...store.stateSignals,
            ...store.computedSignals,
            ...store.methods,
        };
        const hooks = typeof hooksOrFactory === 'function'
            ? hooksOrFactory(storeMembers)
            : hooksOrFactory;
        const createHook = (name) => {
            const hook = hooks[name];
            const currentHook = store.hooks[name];
            return hook
                ? () => {
                    if (currentHook) {
                        currentHook();
                    }
                    hook(storeMembers);
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
            [STATE_SOURCE]: store[STATE_SOURCE],
            ...store.stateSignals,
            ...store.computedSignals,
            ...store.methods,
        });
        assertUniqueStoreMembers(store, Object.keys(methods));
        return {
            ...store,
            methods: { ...store.methods, ...methods },
        };
    };
}

function withState(stateOrFactory) {
    return (store) => {
        const state = typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
        const stateKeys = Object.keys(state);
        assertUniqueStoreMembers(store, stateKeys);
        store[STATE_SOURCE].update((currentState) => ({
            ...currentState,
            ...state,
        }));
        const stateSignals = stateKeys.reduce((acc, key) => {
            const sliceSignal = computed(() => store[STATE_SOURCE]()[key]);
            return { ...acc, [key]: toDeepSignal(sliceSignal) };
        }, {});
        return {
            ...store,
            stateSignals: { ...store.stateSignals, ...stateSignals },
        };
    };
}

/**
 * Generated bundle index. Do not edit.
 */

export { deepComputed, getState, patchState, signalState, signalStore, signalStoreFeature, type, watchState, withComputed, withHooks, withMethods, withState };
//# sourceMappingURL=ngrx-signals.mjs.map
