import { PartialStateUpdater } from '@ngrx/signals';
import { EntityChanges, EntityId, EntityPredicate, EntityState, NamedEntityState } from '../models';
export declare function updateEntities<Entity>(update: {
    ids: EntityId[];
    changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export declare function updateEntities<Entity>(update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export declare function updateEntities<Collection extends string, State extends NamedEntityState<any, Collection>, Entity = State extends NamedEntityState<infer E, Collection> ? E : never>(update: {
    ids: EntityId[];
    changes: EntityChanges<Entity & {}>;
}, config: {
    collection: Collection;
}): PartialStateUpdater<State>;
export declare function updateEntities<Collection extends string, State extends NamedEntityState<any, Collection>, Entity = State extends NamedEntityState<infer E, Collection> ? E : never>(update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<Entity & {}>;
}, config: {
    collection: Collection;
}): PartialStateUpdater<State>;
