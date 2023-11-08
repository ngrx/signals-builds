import { assertInInjectionContext, Injector, inject, DestroyRef, isSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subject, isObservable, of } from 'rxjs';

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
        let input$;
        if (isSignal(input)) {
            input$ = toObservable(input, { injector });
        }
        else if (isObservable(input)) {
            input$ = input;
        }
        else {
            input$ = of(input);
        }
        const instanceSub = input$.subscribe((value) => source$.next(value));
        sourceSub.add(instanceSub);
        return instanceSub;
    };
    rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);
    return rxMethodFn;
}

/**
 * Generated bundle index. Do not edit.
 */

export { rxMethod };
//# sourceMappingURL=ngrx-signals-rxjs-interop.mjs.map
