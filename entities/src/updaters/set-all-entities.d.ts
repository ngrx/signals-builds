import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId, EntityIdKey, EntityState, NamedEntityState } from '../models';
export declare function setAllEntities<Entity extends {
    id: EntityId;
}>(entities: Entity[]): PartialStateUpdater<EntityState<Entity>>;
export declare function setAllEntities<Entity, Collection extends string>(entities: Entity[], config: {
    collection: Collection;
    idKey: EntityIdKey<Entity>;
}): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export declare function setAllEntities<Entity extends {
    id: EntityId;
}, Collection extends string>(entities: Entity[], config: {
    collection: Collection;
}): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export declare function setAllEntities<Entity>(entities: Entity[], config: {
    idKey: EntityIdKey<Entity>;
}): PartialStateUpdater<EntityState<Entity>>;
