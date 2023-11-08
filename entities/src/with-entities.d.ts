import { SignalStoreFeature } from '@ngrx/signals';
import { EntitySignals, EntityState, NamedEntitySignals, NamedEntityState } from './models';
export declare function withEntities<Entity>(): SignalStoreFeature<{
    state: {};
    signals: {};
    methods: {};
}, {
    state: EntityState<Entity>;
    signals: EntitySignals<Entity>;
    methods: {};
}>;
export declare function withEntities<Entity, Collection extends string>(config: {
    entity: Entity;
    collection: Collection;
}): SignalStoreFeature<{
    state: {};
    signals: {};
    methods: {};
}, {
    state: NamedEntityState<Entity, Collection>;
    signals: NamedEntitySignals<Entity, Collection>;
    methods: {};
}>;
export declare function withEntities<Entity>(config: {
    entity: Entity;
}): SignalStoreFeature<{
    state: {};
    signals: {};
    methods: {};
}, {
    state: EntityState<Entity>;
    signals: EntitySignals<Entity>;
    methods: {};
}>;
