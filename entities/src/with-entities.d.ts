import { EmptyFeatureResult, SignalStoreFeature } from '@ngrx/signals';
import { EntityComputed, EntityState, NamedEntityComputed, NamedEntityState } from './models';
export declare function withEntities<Entity>(): SignalStoreFeature<EmptyFeatureResult, {
    state: EntityState<Entity>;
    computed: EntityComputed<Entity>;
    methods: {};
}>;
export declare function withEntities<Entity, Collection extends string>(config: {
    entity: Entity;
    collection: Collection;
}): SignalStoreFeature<EmptyFeatureResult, {
    state: NamedEntityState<Entity, Collection>;
    computed: NamedEntityComputed<Entity, Collection>;
    methods: {};
}>;
export declare function withEntities<Entity>(config: {
    entity: Entity;
}): SignalStoreFeature<EmptyFeatureResult, {
    state: EntityState<Entity>;
    computed: EntityComputed<Entity>;
    methods: {};
}>;
