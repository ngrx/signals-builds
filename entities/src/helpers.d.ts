import { DidMutate, EntityChanges, EntityId, EntityPredicate, EntityState } from './models';
export declare function getEntityIdKey(config?: {
    idKey?: string;
}): string;
export declare function getEntityStateKeys(config?: {
    collection?: string;
}): {
    entityMapKey: string;
    idsKey: string;
    entitiesKey: string;
};
export declare function cloneEntityState(state: Record<string, any>, stateKeys: {
    entityMapKey: string;
    idsKey: string;
}): EntityState<any>;
export declare function getEntityUpdaterResult(state: EntityState<any>, stateKeys: {
    entityMapKey: string;
    idsKey: string;
}, didMutate: DidMutate): Record<string, any>;
export declare function addEntityMutably(state: EntityState<any>, entity: any, idKey: string): DidMutate;
export declare function addEntitiesMutably(state: EntityState<any>, entities: any[], idKey: string): DidMutate;
export declare function setEntityMutably(state: EntityState<any>, entity: any, idKey: string): DidMutate;
export declare function setEntitiesMutably(state: EntityState<any>, entities: any[], idKey: string): DidMutate;
export declare function removeEntitiesMutably(state: EntityState<any>, idsOrPredicate: EntityId[] | EntityPredicate<any>): DidMutate;
export declare function updateEntitiesMutably(state: EntityState<any>, idsOrPredicate: EntityId[] | EntityPredicate<any>, changes: EntityChanges<any>): DidMutate;
