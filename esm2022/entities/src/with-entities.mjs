import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState, } from '@ngrx/signals';
import { getEntityStateKeys } from './helpers';
export function withEntities(config) {
    const { entityMapKey, idsKey, entitiesKey } = getEntityStateKeys(config);
    return signalStoreFeature(withState({
        [entityMapKey]: {},
        [idsKey]: [],
    }), withComputed((store) => ({
        [entitiesKey]: computed(() => {
            const entityMap = store[entityMapKey]();
            const ids = store[idsKey]();
            return ids.map((id) => entityMap[id]);
        }),
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aC1lbnRpdGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc2lnbmFscy9lbnRpdGllcy9zcmMvd2l0aC1lbnRpdGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFFTCxrQkFBa0IsRUFDbEIsWUFBWSxFQUNaLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQVN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUErQi9DLE1BQU0sVUFBVSxZQUFZLENBQVMsTUFHcEM7SUFDQyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6RSxPQUFPLGtCQUFrQixDQUN2QixTQUFTLENBQUM7UUFDUixDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUU7UUFDbEIsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO0tBQ2IsQ0FBQyxFQUNGLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUF1QixDQUFDO1lBQzdELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBZ0IsQ0FBQztZQUUxQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQztLQUNILENBQUMsQ0FBQyxDQUNKLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIFNpZ25hbFN0b3JlRmVhdHVyZSxcbiAgc2lnbmFsU3RvcmVGZWF0dXJlLFxuICB3aXRoQ29tcHV0ZWQsXG4gIHdpdGhTdGF0ZSxcbn0gZnJvbSAnQG5ncngvc2lnbmFscyc7XG5pbXBvcnQge1xuICBFbnRpdHlJZCxcbiAgRW50aXR5TWFwLFxuICBFbnRpdHlTaWduYWxzLFxuICBFbnRpdHlTdGF0ZSxcbiAgTmFtZWRFbnRpdHlTaWduYWxzLFxuICBOYW1lZEVudGl0eVN0YXRlLFxufSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBnZXRFbnRpdHlTdGF0ZUtleXMgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVudGl0aWVzPEVudGl0eT4oKTogU2lnbmFsU3RvcmVGZWF0dXJlPFxuICB7IHN0YXRlOiB7fTsgc2lnbmFsczoge307IG1ldGhvZHM6IHt9IH0sXG4gIHtcbiAgICBzdGF0ZTogRW50aXR5U3RhdGU8RW50aXR5PjtcbiAgICBzaWduYWxzOiBFbnRpdHlTaWduYWxzPEVudGl0eT47XG4gICAgbWV0aG9kczoge307XG4gIH1cbj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aEVudGl0aWVzPEVudGl0eSwgQ29sbGVjdGlvbiBleHRlbmRzIHN0cmluZz4oY29uZmlnOiB7XG4gIGVudGl0eTogRW50aXR5O1xuICBjb2xsZWN0aW9uOiBDb2xsZWN0aW9uO1xufSk6IFNpZ25hbFN0b3JlRmVhdHVyZTxcbiAgeyBzdGF0ZToge307IHNpZ25hbHM6IHt9OyBtZXRob2RzOiB7fSB9LFxuICB7XG4gICAgc3RhdGU6IE5hbWVkRW50aXR5U3RhdGU8RW50aXR5LCBDb2xsZWN0aW9uPjtcbiAgICBzaWduYWxzOiBOYW1lZEVudGl0eVNpZ25hbHM8RW50aXR5LCBDb2xsZWN0aW9uPjtcbiAgICBtZXRob2RzOiB7fTtcbiAgfVxuPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoRW50aXRpZXM8RW50aXR5Pihjb25maWc6IHtcbiAgZW50aXR5OiBFbnRpdHk7XG59KTogU2lnbmFsU3RvcmVGZWF0dXJlPFxuICB7IHN0YXRlOiB7fTsgc2lnbmFsczoge307IG1ldGhvZHM6IHt9IH0sXG4gIHtcbiAgICBzdGF0ZTogRW50aXR5U3RhdGU8RW50aXR5PjtcbiAgICBzaWduYWxzOiBFbnRpdHlTaWduYWxzPEVudGl0eT47XG4gICAgbWV0aG9kczoge307XG4gIH1cbj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aEVudGl0aWVzPEVudGl0eT4oY29uZmlnPzoge1xuICBlbnRpdHk6IEVudGl0eTtcbiAgY29sbGVjdGlvbj86IHN0cmluZztcbn0pOiBTaWduYWxTdG9yZUZlYXR1cmUge1xuICBjb25zdCB7IGVudGl0eU1hcEtleSwgaWRzS2V5LCBlbnRpdGllc0tleSB9ID0gZ2V0RW50aXR5U3RhdGVLZXlzKGNvbmZpZyk7XG5cbiAgcmV0dXJuIHNpZ25hbFN0b3JlRmVhdHVyZShcbiAgICB3aXRoU3RhdGUoe1xuICAgICAgW2VudGl0eU1hcEtleV06IHt9LFxuICAgICAgW2lkc0tleV06IFtdLFxuICAgIH0pLFxuICAgIHdpdGhDb21wdXRlZCgoc3RvcmUpID0+ICh7XG4gICAgICBbZW50aXRpZXNLZXldOiBjb21wdXRlZCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eU1hcCA9IHN0b3JlW2VudGl0eU1hcEtleV0oKSBhcyBFbnRpdHlNYXA8RW50aXR5PjtcbiAgICAgICAgY29uc3QgaWRzID0gc3RvcmVbaWRzS2V5XSgpIGFzIEVudGl0eUlkW107XG5cbiAgICAgICAgcmV0dXJuIGlkcy5tYXAoKGlkKSA9PiBlbnRpdHlNYXBbaWRdKTtcbiAgICAgIH0pLFxuICAgIH0pKVxuICApO1xufVxuIl19