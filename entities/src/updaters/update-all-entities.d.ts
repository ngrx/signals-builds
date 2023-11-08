import { PartialStateUpdater } from '@ngrx/signals';
import { EntityChanges, EntityState, NamedEntityState } from '../models';
export declare function updateAllEntities<Entity>(changes: EntityChanges<Entity & {}>): PartialStateUpdater<EntityState<Entity>>;
export declare function updateAllEntities<Collection extends string, State extends NamedEntityState<any, Collection>, Entity = State extends NamedEntityState<infer E, Collection> ? E : never>(changes: EntityChanges<Entity & {}>, config: {
    collection: Collection;
}): PartialStateUpdater<State>;
