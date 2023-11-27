import { WritableSignal } from '@angular/core';
export declare const STATE_SIGNAL: unique symbol;
export type StateSignal<State extends object> = {
    [STATE_SIGNAL]: WritableSignal<State>;
};
