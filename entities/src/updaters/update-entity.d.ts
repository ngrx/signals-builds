import { PartialStateUpdater } from '@ngrx/signals';
import { EntityChanges, EntityId, EntityState, NamedEntityState } from '../models';
export declare function updateEntity<Entity>(update: {
    id: EntityId;
    changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export declare function updateEntity<Collection extends string, State extends NamedEntityState<any, Collection>, Entity = State extends NamedEntityState<infer E, Collection> ? E : never>(update: {
    id: EntityId;
    changes: EntityChanges<Entity & {}>;
}, config: {
    collection: Collection;
}): PartialStateUpdater<State>;
