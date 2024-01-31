import { assertInInjectionContext, Injector, inject, DestroyRef, isSignal, untracked, effect } from '@angular/core';
import { Subject, isObservable, noop } from 'rxjs';

function rxMethod(generator, config) {
    if (!config?.injector) {
        assertInInjectionContext(rxMethod);
    }
    const injector = config?.injector ?? inject(Injector);
    const destroyRef = injector.get(DestroyRef);
    const source$ = new Subject();
    const sourceSub = generator(source$).subscribe();
    destroyRef.onDestroy(() => sourceSub.unsubscribe());
    const rxMethodFn = (input) => {
        if (isSignal(input)) {
            const watcher = effect(() => {
                const value = input();
                untracked(() => source$.next(value));
            }, { injector });
            const instanceSub = { unsubscribe: () => watcher.destroy() };
            sourceSub.add(instanceSub);
            return instanceSub;
        }
        if (isObservable(input)) {
            const instanceSub = input.subscribe((value) => source$.next(value));
            sourceSub.add(instanceSub);
            return instanceSub;
        }
        source$.next(input);
        return { unsubscribe: noop };
    };
    rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);
    return rxMethodFn;
}

/**
 * Generated bundle index. Do not edit.
 */

export { rxMethod };
//# sourceMappingURL=ngrx-signals-rxjs-interop.mjs.map
