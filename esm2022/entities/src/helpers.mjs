import { DidMutate, } from './models';
export function getEntityIdKey(config) {
    return config?.idKey ?? 'id';
}
export function getEntityStateKeys(config) {
    const collection = config?.collection;
    const entityMapKey = collection === undefined ? 'entityMap' : `${collection}EntityMap`;
    const idsKey = collection === undefined ? 'ids' : `${collection}Ids`;
    const entitiesKey = collection === undefined ? 'entities' : `${collection}Entities`;
    return { entityMapKey, idsKey, entitiesKey };
}
export function cloneEntityState(state, stateKeys) {
    return {
        entityMap: { ...state[stateKeys.entityMapKey] },
        ids: [...state[stateKeys.idsKey]],
    };
}
export function getEntityUpdaterResult(state, stateKeys, didMutate) {
    switch (didMutate) {
        case DidMutate.Both: {
            return {
                [stateKeys.entityMapKey]: state.entityMap,
                [stateKeys.idsKey]: state.ids,
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
export function addEntityMutably(state, entity, idKey) {
    const id = entity[idKey];
    if (state.entityMap[id]) {
        return DidMutate.None;
    }
    state.entityMap[id] = entity;
    state.ids.push(id);
    return DidMutate.Both;
}
export function addEntitiesMutably(state, entities, idKey) {
    let didMutate = DidMutate.None;
    for (const entity of entities) {
        const result = addEntityMutably(state, entity, idKey);
        if (result === DidMutate.Both) {
            didMutate = result;
        }
    }
    return didMutate;
}
export function setEntityMutably(state, entity, idKey) {
    const id = entity[idKey];
    if (state.entityMap[id]) {
        state.entityMap[id] = entity;
        return DidMutate.Entities;
    }
    state.entityMap[id] = entity;
    state.ids.push(id);
    return DidMutate.Both;
}
export function setEntitiesMutably(state, entities, idKey) {
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
export function removeEntitiesMutably(state, idsOrPredicate) {
    const ids = Array.isArray(idsOrPredicate)
        ? idsOrPredicate
        : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
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
export function updateEntitiesMutably(state, idsOrPredicate, changes) {
    const ids = Array.isArray(idsOrPredicate)
        ? idsOrPredicate
        : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
    let didMutate = DidMutate.None;
    for (const id of ids) {
        const entity = state.entityMap[id];
        if (entity) {
            const changesRecord = typeof changes === 'function' ? changes(entity) : changes;
            state.entityMap[id] = { ...entity, ...changesRecord };
            didMutate = DidMutate.Entities;
        }
    }
    return didMutate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc2lnbmFscy9lbnRpdGllcy9zcmMvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxHQUtWLE1BQU0sVUFBVSxDQUFDO0FBRWxCLE1BQU0sVUFBVSxjQUFjLENBQUMsTUFBMkI7SUFDeEQsT0FBTyxNQUFNLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQztBQUMvQixDQUFDO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLE1BQWdDO0lBS2pFLE1BQU0sVUFBVSxHQUFHLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDdEMsTUFBTSxZQUFZLEdBQ2hCLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLFdBQVcsQ0FBQztJQUNwRSxNQUFNLE1BQU0sR0FBRyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxLQUFLLENBQUM7SUFDckUsTUFBTSxXQUFXLEdBQ2YsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsVUFBVSxDQUFDO0lBRWxFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLEtBQTBCLEVBQzFCLFNBR0M7SUFFRCxPQUFPO1FBQ0wsU0FBUyxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQy9DLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNsQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sVUFBVSxzQkFBc0IsQ0FD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QUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFFL0IsS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNyQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCxNQUFNLGFBQWEsR0FDakIsT0FBTyxPQUFPLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM1RCxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxhQUFhLEVBQUUsQ0FBQztZQUN0RCxTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaWRNdXRhdGUsXG4gIEVudGl0eUNoYW5nZXMsXG4gIEVudGl0eUlkLFxuICBFbnRpdHlQcmVkaWNhdGUsXG4gIEVudGl0eVN0YXRlLFxufSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnRpdHlJZEtleShjb25maWc/OiB7IGlkS2V5Pzogc3RyaW5nIH0pOiBzdHJpbmcge1xuICByZXR1cm4gY29uZmlnPy5pZEtleSA/PyAnaWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW50aXR5U3RhdGVLZXlzKGNvbmZpZz86IHsgY29sbGVjdGlvbj86IHN0cmluZyB9KToge1xuICBlbnRpdHlNYXBLZXk6IHN0cmluZztcbiAgaWRzS2V5OiBzdHJpbmc7XG4gIGVudGl0aWVzS2V5OiBzdHJpbmc7XG59IHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IGNvbmZpZz8uY29sbGVjdGlvbjtcbiAgY29uc3QgZW50aXR5TWFwS2V5ID1cbiAgICBjb2xsZWN0aW9uID09PSB1bmRlZmluZWQgPyAnZW50aXR5TWFwJyA6IGAke2NvbGxlY3Rpb259RW50aXR5TWFwYDtcbiAgY29uc3QgaWRzS2V5ID0gY29sbGVjdGlvbiA9PT0gdW5kZWZpbmVkID8gJ2lkcycgOiBgJHtjb2xsZWN0aW9ufUlkc2A7XG4gIGNvbnN0IGVudGl0aWVzS2V5ID1cbiAgICBjb2xsZWN0aW9uID09PSB1bmRlZmluZWQgPyAnZW50aXRpZXMnIDogYCR7Y29sbGVjdGlvbn1FbnRpdGllc2A7XG5cbiAgcmV0dXJuIHsgZW50aXR5TWFwS2V5LCBpZHNLZXksIGVudGl0aWVzS2V5IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUVudGl0eVN0YXRlKFxuICBzdGF0ZTogUmVjb3JkPHN0cmluZywgYW55PixcbiAgc3RhdGVLZXlzOiB7XG4gICAgZW50aXR5TWFwS2V5OiBzdHJpbmc7XG4gICAgaWRzS2V5OiBzdHJpbmc7XG4gIH1cbik6IEVudGl0eVN0YXRlPGFueT4ge1xuICByZXR1cm4ge1xuICAgIGVudGl0eU1hcDogeyAuLi5zdGF0ZVtzdGF0ZUtleXMuZW50aXR5TWFwS2V5XSB9LFxuICAgIGlkczogWy4uLnN0YXRlW3N0YXRlS2V5cy5pZHNLZXldXSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudGl0eVVwZGF0ZXJSZXN1bHQoXG4gIHN0YXRlOiBFbnRpdHlTdGF0ZTxhbnk+LFxuICBzdGF0ZUtleXM6IHtcbiAgICBlbnRpdHlNYXBLZXk6IHN0cmluZztcbiAgICBpZHNLZXk6IHN0cmluZztcbiAgfSxcbiAgZGlkTXV0YXRlOiBEaWRNdXRhdGVcbik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBzd2l0Y2ggKGRpZE11dGF0ZSkge1xuICAgIGNhc2UgRGlkTXV0YXRlLkJvdGg6IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFtzdGF0ZUtleXMuZW50aXR5TWFwS2V5XTogc3RhdGUuZW50aXR5TWFwLFxuICAgICAgICBbc3RhdGVLZXlzLmlkc0tleV06IHN0YXRlLmlkcyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRGlkTXV0YXRlLkVudGl0aWVzOiB7XG4gICAgICByZXR1cm4geyBbc3RhdGVLZXlzLmVudGl0eU1hcEtleV06IHN0YXRlLmVudGl0eU1hcCB9O1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRFbnRpdHlNdXRhYmx5KFxuICBzdGF0ZTogRW50aXR5U3RhdGU8YW55PixcbiAgZW50aXR5OiBhbnksXG4gIGlkS2V5OiBzdHJpbmdcbik6IERpZE11dGF0ZSB7XG4gIGNvbnN0IGlkID0gZW50aXR5W2lkS2V5XTtcblxuICBpZiAoc3RhdGUuZW50aXR5TWFwW2lkXSkge1xuICAgIHJldHVybiBEaWRNdXRhdGUuTm9uZTtcbiAgfVxuXG4gIHN0YXRlLmVudGl0eU1hcFtpZF0gPSBlbnRpdHk7XG4gIHN0YXRlLmlkcy5wdXNoKGlkKTtcblxuICByZXR1cm4gRGlkTXV0YXRlLkJvdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRFbnRpdGllc011dGFibHkoXG4gIHN0YXRlOiBFbnRpdHlTdGF0ZTxhbnk+LFxuICBlbnRpdGllczogYW55W10sXG4gIGlkS2V5OiBzdHJpbmdcbik6IERpZE11dGF0ZSB7XG4gIGxldCBkaWRNdXRhdGUgPSBEaWRNdXRhdGUuTm9uZTtcblxuICBmb3IgKGNvbnN0IGVudGl0eSBvZiBlbnRpdGllcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGFkZEVudGl0eU11dGFibHkoc3RhdGUsIGVudGl0eSwgaWRLZXkpO1xuXG4gICAgaWYgKHJlc3VsdCA9PT0gRGlkTXV0YXRlLkJvdGgpIHtcbiAgICAgIGRpZE11dGF0ZSA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlkTXV0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RW50aXR5TXV0YWJseShcbiAgc3RhdGU6IEVudGl0eVN0YXRlPGFueT4sXG4gIGVudGl0eTogYW55LFxuICBpZEtleTogc3RyaW5nXG4pOiBEaWRNdXRhdGUge1xuICBjb25zdCBpZCA9IGVudGl0eVtpZEtleV07XG5cbiAgaWYgKHN0YXRlLmVudGl0eU1hcFtpZF0pIHtcbiAgICBzdGF0ZS5lbnRpdHlNYXBbaWRdID0gZW50aXR5O1xuICAgIHJldHVybiBEaWRNdXRhdGUuRW50aXRpZXM7XG4gIH1cblxuICBzdGF0ZS5lbnRpdHlNYXBbaWRdID0gZW50aXR5O1xuICBzdGF0ZS5pZHMucHVzaChpZCk7XG5cbiAgcmV0dXJuIERpZE11dGF0ZS5Cb3RoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RW50aXRpZXNNdXRhYmx5KFxuICBzdGF0ZTogRW50aXR5U3RhdGU8YW55PixcbiAgZW50aXRpZXM6IGFueVtdLFxuICBpZEtleTogc3RyaW5nXG4pOiBEaWRNdXRhdGUge1xuICBsZXQgZGlkTXV0YXRlID0gRGlkTXV0YXRlLk5vbmU7XG5cbiAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzZXRFbnRpdHlNdXRhYmx5KHN0YXRlLCBlbnRpdHksIGlkS2V5KTtcblxuICAgIGlmIChkaWRNdXRhdGUgPT09IERpZE11dGF0ZS5Cb3RoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBkaWRNdXRhdGUgPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gZGlkTXV0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRW50aXRpZXNNdXRhYmx5KFxuICBzdGF0ZTogRW50aXR5U3RhdGU8YW55PixcbiAgaWRzT3JQcmVkaWNhdGU6IEVudGl0eUlkW10gfCBFbnRpdHlQcmVkaWNhdGU8YW55PlxuKTogRGlkTXV0YXRlIHtcbiAgY29uc3QgaWRzID0gQXJyYXkuaXNBcnJheShpZHNPclByZWRpY2F0ZSlcbiAgICA/IGlkc09yUHJlZGljYXRlXG4gICAgOiBzdGF0ZS5pZHMuZmlsdGVyKChpZCkgPT4gaWRzT3JQcmVkaWNhdGUoc3RhdGUuZW50aXR5TWFwW2lkXSkpO1xuICBsZXQgZGlkTXV0YXRlID0gRGlkTXV0YXRlLk5vbmU7XG5cbiAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICBpZiAoc3RhdGUuZW50aXR5TWFwW2lkXSkge1xuICAgICAgZGVsZXRlIHN0YXRlLmVudGl0eU1hcFtpZF07XG4gICAgICBkaWRNdXRhdGUgPSBEaWRNdXRhdGUuQm90aDtcbiAgICB9XG4gIH1cblxuICBpZiAoZGlkTXV0YXRlID09PSBEaWRNdXRhdGUuQm90aCkge1xuICAgIHN0YXRlLmlkcyA9IHN0YXRlLmlkcy5maWx0ZXIoKGlkKSA9PiBpZCBpbiBzdGF0ZS5lbnRpdHlNYXApO1xuICB9XG5cbiAgcmV0dXJuIGRpZE11dGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUVudGl0aWVzTXV0YWJseShcbiAgc3RhdGU6IEVudGl0eVN0YXRlPGFueT4sXG4gIGlkc09yUHJlZGljYXRlOiBFbnRpdHlJZFtdIHwgRW50aXR5UHJlZGljYXRlPGFueT4sXG4gIGNoYW5nZXM6IEVudGl0eUNoYW5nZXM8YW55PlxuKTogRGlkTXV0YXRlIHtcbiAgY29uc3QgaWRzID0gQXJyYXkuaXNBcnJheShpZHNPclByZWRpY2F0ZSlcbiAgICA/IGlkc09yUHJlZGljYXRlXG4gICAgOiBzdGF0ZS5pZHMuZmlsdGVyKChpZCkgPT4gaWRzT3JQcmVkaWNhdGUoc3RhdGUuZW50aXR5TWFwW2lkXSkpO1xuICBsZXQgZGlkTXV0YXRlID0gRGlkTXV0YXRlLk5vbmU7XG5cbiAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICBjb25zdCBlbnRpdHkgPSBzdGF0ZS5lbnRpdHlNYXBbaWRdO1xuXG4gICAgaWYgKGVudGl0eSkge1xuICAgICAgY29uc3QgY2hhbmdlc1JlY29yZCA9XG4gICAgICAgIHR5cGVvZiBjaGFuZ2VzID09PSAnZnVuY3Rpb24nID8gY2hhbmdlcyhlbnRpdHkpIDogY2hhbmdlcztcbiAgICAgIHN0YXRlLmVudGl0eU1hcFtpZF0gPSB7IC4uLmVudGl0eSwgLi4uY2hhbmdlc1JlY29yZCB9O1xuICAgICAgZGlkTXV0YXRlID0gRGlkTXV0YXRlLkVudGl0aWVzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaWRNdXRhdGU7XG59XG4iXX0=