import * as i0 from '@angular/core';
import { untracked, isSignal, computed, assertInInjectionContext, inject, Injector, effect, DestroyRef, signal, Injectable } from '@angular/core';

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
const nonRecords = [
    WeakSet,
    WeakMap,
    Promise,
    Date,
    Error,
    RegExp,
    ArrayBuffer,
    DataView,
    Function,
];
function isRecord(value) {
    if (value === null || typeof value !== 'object' || isIterable(value)) {
        return false;
    }
    let proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype) {
        return true;
    }
    while (proto && proto !== Object.prototype) {
        if (nonRecords.includes(proto.constructor)) {
            return false;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return proto === Object.prototype;
}
function isIterable(value) {
    return typeof value?.[Symbol.iterator] === 'function';
}

function deepComputed(computation) {
    return toDeepSignal(computed(computation));
}

function signalMethod(processingFn, config) {
    if (!config?.injector) {
        assertInInjectionContext(signalMethod);
    }
    const watchers = [];
    const sourceInjector = config?.injector ?? inject(Injector);
    const signalMethodFn = (input, config) => {
        if (isSignal(input)) {
            const instanceInjector = config?.injector ?? getCallerInjector() ?? sourceInjector;
            const watcher = effect((onCleanup) => {
                const value = input();
                untracked(() => processingFn(value));
                onCleanup(() => watchers.splice(watchers.indexOf(watcher), 1));
            }, { injector: instanceInjector });
            watchers.push(watcher);
            return watcher;
        }
        else {
            processingFn(input);
            return { destroy: () => void true };
        }
    };
    signalMethodFn.destroy = () => watchers.forEach((watcher) => watcher.destroy());
    return signalMethodFn;
}
function getCallerInjector() {
    try {
        return inject(Injector);
    }
    catch {
        return null;
    }
}

function deepFreeze(target) {
    Object.freeze(target);
    const targetIsFunction = typeof target === 'function';
    Object.getOwnPropertyNames(target).forEach((prop) => {
        // Ignore Ivy properties, ref: https://github.com/ngrx/platform/issues/2109#issuecomment-582689060
        if (prop.startsWith('ɵ')) {
            return;
        }
        if (hasOwnProperty(target, prop) &&
            (targetIsFunction
                ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
                : true)) {
            const propValue = target[prop];
            if ((isObjectLike(propValue) || typeof propValue === 'function') &&
                !Object.isFrozen(propValue)) {
                deepFreeze(propValue);
            }
        }
    });
    return target;
}
function freezeInDevMode(target) {
    return ngDevMode ? deepFreeze(target) : target;
}
function hasOwnProperty(target, propertyName) {
    return isObjectLike(target)
        ? Object.prototype.hasOwnProperty.call(target, propertyName)
        : false;
}
function isObjectLike(target) {
    return typeof target === 'object' && target !== null;
}

const STATE_WATCHERS = new WeakMap();
const STATE_SOURCE = Symbol('STATE_SOURCE');
function patchState(stateSource, ...updaters) {
    stateSource[STATE_SOURCE].update((currentState) => updaters.reduce((nextState, updater) => freezeInDevMode({
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
    const stateSource = signal(freezeInDevMode(initialState));
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
            const { stateSignals, props, methods, hooks } = innerStore;
            const storeMembers = { ...stateSignals, ...props, ...methods };
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
        /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.0", ngImport: i0, type: SignalStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
        /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.0.0", ngImport: i0, type: SignalStore, providedIn: config.providedIn || null });
    }
    i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.0", ngImport: i0, type: SignalStore, decorators: [{
                type: Injectable,
                args: [{ providedIn: config.providedIn || null }]
            }], ctorParameters: () => [] });
    return SignalStore;
}
function getInitialInnerStore() {
    return {
        [STATE_SOURCE]: signal({}),
        stateSignals: {},
        props: {},
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
        ...store.props,
        ...store.methods,
    };
    const overriddenKeys = Object.keys(storeMembers).filter((memberKey) => newMemberKeys.includes(memberKey));
    if (overriddenKeys.length > 0) {
        console.warn('@ngrx/signals: SignalStore members cannot be overridden.', 'Trying to override:', overriddenKeys.join(', '));
    }
}

function withProps(propsFactory) {
    return (store) => {
        const props = propsFactory({
            [STATE_SOURCE]: store[STATE_SOURCE],
            ...store.stateSignals,
            ...store.props,
            ...store.methods,
        });
        assertUniqueStoreMembers(store, Object.keys(props));
        return {
            ...store,
            props: { ...store.props, ...props },
        };
    };
}

function withComputed(signalsFactory) {
    return withProps(signalsFactory);
}

function withHooks(hooksOrFactory) {
    return (store) => {
        const storeMembers = {
            [STATE_SOURCE]: store[STATE_SOURCE],
            ...store.stateSignals,
            ...store.props,
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
            ...store.props,
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
        store[STATE_SOURCE].update((currentState) => freezeInDevMode({
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

export { deepComputed, getState, patchState, signalMethod, signalState, signalStore, signalStoreFeature, type, watchState, withComputed, withHooks, withMethods, withProps, withState };
//# sourceMappingURL=ngrx-signals.mjs.map
