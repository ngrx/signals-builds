// src/models.mjs
var DidMutate;
(function(DidMutate2) {
  DidMutate2[DidMutate2["None"] = 0] = "None";
  DidMutate2[DidMutate2["Entities"] = 1] = "Entities";
  DidMutate2[DidMutate2["Both"] = 2] = "Both";
})(DidMutate || (DidMutate = {}));

// src/helpers.mjs
function getEntityIdKey(config) {
  return config?.idKey ?? "id";
}
function getEntityStateKeys(config) {
  const collection = config?.collection;
  const entityMapKey = collection === void 0 ? "entityMap" : `${collection}EntityMap`;
  const idsKey = collection === void 0 ? "ids" : `${collection}Ids`;
  const entitiesKey = collection === void 0 ? "entities" : `${collection}Entities`;
  return { entityMapKey, idsKey, entitiesKey };
}
function cloneEntityState(state, stateKeys) {
  return {
    entityMap: { ...state[stateKeys.entityMapKey] },
    ids: [...state[stateKeys.idsKey]]
  };
}
function getEntityUpdaterResult(state, stateKeys, didMutate) {
  switch (didMutate) {
    case DidMutate.Both: {
      return {
        [stateKeys.entityMapKey]: state.entityMap,
        [stateKeys.idsKey]: state.ids
      };
    }
    case DidMutate.Entities: {
      return { [stateKeys.entityMapKey]: state.entityMap };
    }
    default: {
      return {};
    }
  }
}
function addEntityMutably(state, entity, idKey) {
  const id = entity[idKey];
  if (state.entityMap[id]) {
    return DidMutate.None;
  }
  state.entityMap[id] = entity;
  state.ids.push(id);
  return DidMutate.Both;
}
function addEntitiesMutably(state, entities, idKey) {
  let didMutate = DidMutate.None;
  for (const entity of entities) {
    const result = addEntityMutably(state, entity, idKey);
    if (result === DidMutate.Both) {
      didMutate = result;
    }
  }
  return didMutate;
}
function setEntityMutably(state, entity, idKey) {
  const id = entity[idKey];
  if (state.entityMap[id]) {
    state.entityMap[id] = entity;
    return DidMutate.Entities;
  }
  state.entityMap[id] = entity;
  state.ids.push(id);
  return DidMutate.Both;
}
function setEntitiesMutably(state, entities, idKey) {
  let didMutate = DidMutate.None;
  for (const entity of entities) {
    const result = setEntityMutably(state, entity, idKey);
    if (didMutate === DidMutate.Both) {
      continue;
    }
    didMutate = result;
  }
  return didMutate;
}
function removeEntitiesMutably(state, idsOrPredicate) {
  const ids = Array.isArray(idsOrPredicate) ? idsOrPredicate : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let didMutate = DidMutate.None;
  for (const id of ids) {
    if (state.entityMap[id]) {
      delete state.entityMap[id];
      didMutate = DidMutate.Both;
    }
  }
  if (didMutate === DidMutate.Both) {
    state.ids = state.ids.filter((id) => id in state.entityMap);
  }
  return didMutate;
}
function updateEntitiesMutably(state, idsOrPredicate, changes) {
  const ids = Array.isArray(idsOrPredicate) ? idsOrPredicate : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let didMutate = DidMutate.None;
  for (const id of ids) {
    const entity = state.entityMap[id];
    if (entity) {
      const changesRecord = typeof changes === "function" ? changes(entity) : changes;
      state.entityMap[id] = { ...entity, ...changesRecord };
      didMutate = DidMutate.Entities;
    }
  }
  return didMutate;
}

// src/updaters/add-entity.mjs
function addEntity(entity, config) {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, idKey);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/add-entities.mjs
function addEntities(entities, config) {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntitiesMutably(clonedState, entities, idKey);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/remove-entity.mjs
function removeEntity(id, config) {
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, [id]);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/remove-entities.mjs
function removeEntities(idsOrPredicate, config) {
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, idsOrPredicate);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/remove-all-entities.mjs
function removeAllEntities(config) {
  const stateKeys = getEntityStateKeys(config);
  return () => ({
    [stateKeys.entityMapKey]: {},
    [stateKeys.idsKey]: []
  });
}

// src/updaters/set-entity.mjs
function setEntity(entity, config) {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntityMutably(clonedState, entity, idKey);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/set-entities.mjs
function setEntities(entities, config) {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntitiesMutably(clonedState, entities, idKey);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/set-all-entities.mjs
function setAllEntities(entities, config) {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);
  return () => {
    const state = { entityMap: {}, ids: [] };
    setEntitiesMutably(state, entities, idKey);
    return {
      [stateKeys.entityMapKey]: state.entityMap,
      [stateKeys.idsKey]: state.ids
    };
  };
}

// src/updaters/update-entity.mjs
function updateEntity(update, config) {
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(clonedState, [update.id], update.changes);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/update-entities.mjs
function updateEntities(update, config) {
  const stateKeys = getEntityStateKeys(config);
  const idsOrPredicate = "ids" in update ? update.ids : update.predicate;
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(clonedState, idsOrPredicate, update.changes);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/updaters/update-all-entities.mjs
function updateAllEntities(changes, config) {
  const stateKeys = getEntityStateKeys(config);
  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(clonedState, state[stateKeys.idsKey], changes);
    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}

// src/with-entities.mjs
import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";
function withEntities(config) {
  const { entityMapKey, idsKey, entitiesKey } = getEntityStateKeys(config);
  return signalStoreFeature(withState({
    [entityMapKey]: {},
    [idsKey]: []
  }), withComputed((store) => ({
    [entitiesKey]: computed(() => {
      const entityMap = store[entityMapKey]();
      const ids = store[idsKey]();
      return ids.map((id) => entityMap[id]);
    })
  })));
}
export {
  addEntities,
  addEntity,
  removeAllEntities,
  removeEntities,
  removeEntity,
  setAllEntities,
  setEntities,
  setEntity,
  updateAllEntities,
  updateEntities,
  updateEntity,
  withEntities
};
//# sourceMappingURL=ngrx-signals-entities.mjs.map
