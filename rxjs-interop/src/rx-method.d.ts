import { Injector, Signal } from '@angular/core';
import { Observable, Unsubscribable } from 'rxjs';
type RxMethod<Input> = ((input: Input | Signal<Input> | Observable<Input>, config?: {
    injector?: Injector;
}) => Unsubscribable) & Unsubscribable;
export declare function rxMethod<Input>(generator: (source$: Observable<Input>) => Observable<unknown>, config?: {
    injector?: Injector;
}): RxMethod<Input>;
export {};
