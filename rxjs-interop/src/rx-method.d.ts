import { Injector, Signal } from '@angular/core';
import { Observable, Unsubscribable } from 'rxjs';
type RxMethodInput<Input> = Input | Observable<Input> | Signal<Input>;
type RxMethod<Input> = ((input: RxMethodInput<Input>) => Unsubscribable) & Unsubscribable;
export declare function rxMethod<Input>(generator: (source$: Observable<Input>) => Observable<unknown>, config?: {
    injector?: Injector;
}): RxMethod<Input>;
export {};
